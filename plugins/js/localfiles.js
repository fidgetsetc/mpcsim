// MPCSIM FILE ROUTER
// Injects a shared save/open destination prompt into mpcsim app windows.
// mpcsim Files now stores file contents in IndexedDB (previously localStorage, which
// choked on anything but tiny files once content was base64-encoded into a data URL).
// OS-file choices still defer to the browser's native picker/download UI.
// Install as a custom plugin and run it. Only works in apps whose iframe is same-origin.

(() => {
  const PLUGIN_ID = 'mpcsim-file-router';
  const DB_NAME = 'mpcsim_file_router';
  const DB_VERSION = 1;
  const STORE_NAME = 'files';
  const STYLE_ID = 'mpcsim-file-router-style';
  const DIALOG_ID = 'mpcsim-file-router-dialog';
  const patched = new WeakSet();
  const observers = new Set();
  let scanTimer = null;
  let activeRequest = null;
  let z = 2147483000;

  const safeName = (s) => String(s || 'Untitled').replace(/[\\/:*?"<>|]/g, '_').slice(0, 180) || 'Untitled';

  // ── IndexedDB-backed file store ──────────────────────────────────────────
  // Records are {id, name, type, size, modified, blob}; the blob is stored
  // directly (IndexedDB supports Blobs natively), so there's no base64 bloat
  // and no practical size ceiling like localStorage had.
  let filesCache = [];
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (e) { reject(e); return; }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Could not open file store'));
    });
    return dbPromise;
  }

  function withStore(mode, fn) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const result = fn(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('File store transaction failed'));
      tx.onabort = () => reject(tx.error || new Error('File store transaction aborted'));
    }));
  }

  // Resolves once the on-disk records have been loaded into filesCache.
  // readFiles() can be called before this settles (it just returns [] / the
  // last-known list until then); call sites that need the current contents
  // (the file browser) await dbReady first.
  const dbReady = withStore('readonly', store => new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => { filesCache = req.result || []; resolve(); };
    req.onerror = () => reject(req.error);
  })).catch(e => { mpc.log && mpc.log('File store load failed: ' + e.message); filesCache = []; });

  const readFiles = () => filesCache;

  async function putFile(record) {
    filesCache = filesCache.filter(f => f.name !== record.name);
    filesCache.push(record);
    try { await withStore('readwrite', store => store.put(record)); }
    catch (e) { mpc.log && mpc.log('File store save failed: ' + e.message); }
    return record;
  }

  async function removeFileByName(name) {
    const rec = filesCache.find(f => f.name === name);
    filesCache = filesCache.filter(f => f.name !== name);
    if (!rec) return;
    try { await withStore('readwrite', store => store.delete(rec.id)); }
    catch (e) { mpc.log && mpc.log('File store delete failed: ' + e.message); }
  }

  const fileToRecord = (file, name) => ({
    id: 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: safeName(name || file.name),
    type: file.type || 'application/octet-stream',
    size: file.size,
    modified: Date.now(),
    blob: file
  });

  function installStyle(doc) {
    if (doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${DIALOG_ID}{position:fixed;inset:0;z-index:${z};display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.62);font:14px 'Segoe UI',sans-serif;color:#f4f4f4}
      #${DIALOG_ID} *{box-sizing:border-box}
      #${DIALOG_ID} .fr-card{width:min(520px,calc(100vw - 28px));max-height:88vh;display:flex;flex-direction:column;background:#252525;border-top:3px solid var(--accent,#0078d4);box-shadow:0 14px 50px #0009}
      #${DIALOG_ID} .fr-head{padding:18px 22px;background:#1b1b1b;font-size:19px;font-weight:300}
      #${DIALOG_ID} .fr-body{padding:18px 22px;overflow:auto}
      #${DIALOG_ID} .fr-sub{color:#aaa;font-size:12px;margin-bottom:14px;line-height:1.45}
      #${DIALOG_ID} .fr-choice{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:15px;margin:8px 0;background:#303030;color:#fff;border:1px solid #484848;border-left:3px solid var(--accent,#0078d4);cursor:pointer;font:14px 'Segoe UI',sans-serif}
      #${DIALOG_ID} .fr-choice:hover{background:#3b3b3b}
      #${DIALOG_ID} .fr-icon{width:34px;height:34px;display:grid;place-items:center;background:#414141;font-size:20px;flex-shrink:0}
      #${DIALOG_ID} .fr-label{font-weight:600}
      #${DIALOG_ID} .fr-desc{font-size:11px;color:#aaa;margin-top:3px}
      #${DIALOG_ID} .fr-files{width:100%;border-collapse:collapse;font-size:12px}
      #${DIALOG_ID} .fr-files td{padding:9px 5px;border-bottom:1px solid #444;overflow-wrap:anywhere}
      #${DIALOG_ID} .fr-files tr{cursor:pointer}
      #${DIALOG_ID} .fr-files tr:hover{background:#383838}
      #${DIALOG_ID} .fr-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 22px;background:#1b1b1b;border-top:1px solid #3b3b3b}
      #${DIALOG_ID} button.fr-btn{border:0;padding:8px 16px;background:#3b3b3b;color:#fff;cursor:pointer;font:13px 'Segoe UI',sans-serif}
      #${DIALOG_ID} button.fr-primary{background:var(--accent,#0078d4)}
      #${DIALOG_ID} .fr-input{width:100%;padding:9px;background:#171717;border:1px solid #555;color:#fff;font:13px 'Segoe UI',sans-serif;margin:8px 0}
      #${DIALOG_ID} .fr-empty{padding:20px 4px;color:#aaa;text-align:center}
    `;
    (doc.head || doc.documentElement).appendChild(style);
  }

  function dialogDoc() {
    const d = mpc.doc();
    installStyle(d);
    return d;
  }

  function closeDialog() {
    const d = dialogDoc();
    const el = d.getElementById(DIALOG_ID);
    if (el) el.remove();
    activeRequest = null;
  }

  function showDialog(kind, details, handlers) {
    closeDialog();
    const d = dialogDoc();
    const overlay = d.createElement('div');
    overlay.id = DIALOG_ID;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const title = kind === 'open' ? 'Where do you want to open the file?' : 'Where do you want to save the file?';
    overlay.innerHTML = `<div class="fr-card"><div class="fr-head">${title}</div><div class="fr-body">
      <div class="fr-sub">${kind === 'open' ? 'Choose where this app should get its file from.' : 'Choose where this app should put its file.'}</div>
      <button class="fr-choice" data-dest="virtual"><span class="fr-icon">▣</span><span><div class="fr-label">mpcsim Files</div><div class="fr-desc">Browse files stored inside this mpcsim desktop</div></span></button>
      <button class="fr-choice" data-dest="os"><span class="fr-icon">▤</span><span><div class="fr-label">Operating system from Navigator Files</div><div class="fr-desc">Use the browser or operating system file picker</div></span></button>
    </div><div class="fr-foot"><button class="fr-btn" data-cancel>Cancel</button></div></div>`;
    overlay.querySelector('[data-cancel]').onclick = () => { closeDialog(); handlers.cancel && handlers.cancel(); };
    overlay.querySelector('[data-dest="virtual"]').onclick = () => { closeDialog(); handlers.virtual(); };
    overlay.querySelector('[data-dest="os"]').onclick = () => { closeDialog(); handlers.os(); };
    overlay.addEventListener('click', e => { if (e.target === overlay) { closeDialog(); handlers.cancel && handlers.cancel(); } });
    d.body.appendChild(overlay);
    activeRequest = {kind, details, handlers};
  }

  async function showFileBrowser(mode, request, done) {
    await dbReady;
    const d = dialogDoc();
    closeDialog();
    const overlay = d.createElement('div');
    overlay.id = DIALOG_ID;
    const files = readFiles();
    const accept = request.input && request.input.accept;
    const filtered = mode === 'open' ? files.filter(f => {
      if (!accept) return true;
      return accept.split(',').some(a => {
        a = a.trim().toLowerCase();
        return a.startsWith('.') ? f.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? f.type.toLowerCase().startsWith(a.slice(0, -1)) : f.type.toLowerCase() === a;
      });
    }) : files;
    overlay.innerHTML = `<div class="fr-card"><div class="fr-head">${mode === 'open' ? 'Open from mpcsim Files' : 'Save to mpcsim Files'}</div>
      <div class="fr-body">
        ${mode === 'save' ? `<label for="fr-name">File name</label><input class="fr-input" id="fr-name" value="${escapeHTML(request.name || 'Untitled.txt')}">` : ''}
        <div class="fr-sub">${mode === 'open' ? 'Select a file to pass it to the app.' : 'Files are stored in this browser profile for this mpcsim installation.'}</div>
        <table class="fr-files"><tbody>${filtered.map(f => `<tr data-id="${escapeHTML(f.id)}"><td>${escapeHTML(f.name)}</td><td>${formatSize(f.size)}</td><td>${new Date(f.modified).toLocaleDateString()}</td></tr>`).join('')}</tbody></table>
        ${mode === 'open' && !filtered.length ? '<div class="fr-empty">No matching files yet.</div>' : ''}
        ${mode === 'save' ? '<label for="fr-overwrite">If a file with this name exists, replace it.</label>' : ''}
      </div><div class="fr-foot"><button class="fr-btn" data-cancel>Cancel</button><button class="fr-btn fr-primary" data-confirm>${mode === 'open' ? 'Open selected' : 'Save'}</button></div></div>`;
    let selected = null;
    overlay.querySelectorAll('tr[data-id]').forEach(tr => tr.onclick = () => {
      overlay.querySelectorAll('tr').forEach(x => x.style.background = '');
      tr.style.background = '#164e78';
      selected = tr.dataset.id;
    });
    overlay.querySelector('[data-cancel]').onclick = () => { closeDialog(); };
    overlay.querySelector('[data-confirm]').onclick = async () => {
      try {
        if (mode === 'open') {
          if (!selected) { mpc.notify('Select a file first.'); return; }
          const record = readFiles().find(f => f.id === selected);
          if (!record) throw new Error('That file no longer exists.');
          const file = new File([record.blob], record.name, {type: record.type, lastModified: record.modified});
          closeDialog(); done(file, record);
        } else {
          const name = safeName(overlay.querySelector('#fr-name').value || request.name || 'Untitled.txt');
          const blob = await request.getBlob();
          const record = await putFile(fileToRecord(new File([blob], name, {type: blob.type || request.type || 'application/octet-stream'}), name));
          closeDialog();
          mpc.notify('Saved to mpcsim Files: ' + name);
          done && done(record);
        }
      } catch (e) { mpc.notify('File operation failed: ' + e.message); }
    };
    d.body.appendChild(overlay);
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function formatSize(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
    return (n/1024/1024).toFixed(1) + ' MB';
  }

  function nativeOpen(input, originalClick) {
    if (input.__mpcNativePicker) return originalClick();
    input.__mpcNativePicker = true;
    try { originalClick(); } finally { setTimeout(() => { input.__mpcNativePicker = false; }, 500); }
  }

  function patchInput(input, win) {
    if (patched.has(input)) return;
    patched.add(input);
    const originalClick = input.click.bind(input);
    input.click = function() {
      if (input.type !== 'file' || input.__mpcNativePicker) return originalClick();
      showDialog('open', {input}, {
        cancel() {},
        os: () => nativeOpen(input, originalClick),
        virtual: () => showFileBrowser('open', {input}, file => {
          try {
            const dt = new DataTransfer();
            dt.items.add(file);
            Object.defineProperty(input, 'files', {configurable:true, get:() => dt.files});
            input.dispatchEvent(new Event('input', {bubbles:true}));
            input.dispatchEvent(new Event('change', {bubbles:true}));
          } catch (e) { mpc.notify('This app would not accept the selected file: ' + e.message); }
        })
      });
    };
    // Capture picker activation from labels/buttons that cause a file input to open.
    input.addEventListener('click', e => {
      if (input.__mpcNativePicker) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      showDialog('open', {input}, {
        cancel() {},
        os: () => nativeOpen(input, originalClick),
        virtual: () => showFileBrowser('open', {input}, file => {
          try {
            const dt = new DataTransfer();
            dt.items.add(file);
            Object.defineProperty(input, 'files', {configurable:true, get:() => dt.files});
            input.dispatchEvent(new Event('input', {bubbles:true}));
            input.dispatchEvent(new Event('change', {bubbles:true}));
          } catch (err) { mpc.notify('This app would not accept the selected file: ' + err.message); }
        })
      });
    }, true);
  }

  function patchAnchor(a, win) {
    if (patched.has(a)) return;
    patched.add(a);
    a.addEventListener('click', async e => {
      if (!a.hasAttribute('download') && !/^blob:/.test(a.href || '') && !/^data:/.test(a.href || '')) return;
      if (a.__mpcAllowNative) { a.__mpcAllowNative = false; return; }
      e.preventDefault();
      e.stopImmediatePropagation();
      const name = safeName(a.getAttribute('download') || (a.href.split('/').pop() || 'download.bin'));
      let blobPromise;
      try {
        if (a.href.startsWith('blob:') || a.href.startsWith('data:')) blobPromise = fetch(a.href).then(r => r.blob());
        else blobPromise = Promise.resolve(new Blob([a.href], {type:'text/plain'}));
      } catch (_) { blobPromise = Promise.resolve(new Blob([a.href], {type:'text/plain'})); }
      showDialog('save', {name}, {
        cancel() {},
        os: async () => {
          a.__mpcAllowNative = true;
          if (a.href.startsWith('blob:') || a.href.startsWith('data:')) a.click();
          else {
            const blob = await blobPromise;
            const url = URL.createObjectURL(blob);
            const tmp = win.document.createElement('a');
            tmp.href = url; tmp.download = name; tmp.__mpcAllowNative = true;
            win.document.body.appendChild(tmp); tmp.click(); tmp.remove();
            setTimeout(() => URL.revokeObjectURL(url), 3000);
          }
        },
        virtual: () => showFileBrowser('save', {name, type:'application/octet-stream', getBlob:() => blobPromise})
      });
    }, true);
  }

  function patchWindow(win) {
    let doc;
    try { doc = win.document; if (!doc || !doc.documentElement) return; void doc.documentElement; }
    catch (_) { return; }
    if (win === window) return;
    try {
      if (win.__mpcFileRouterPatched) return;
      win.__mpcFileRouterPatched = true;
      const originalShowSave = win.showSaveFilePicker;
      const originalShowOpen = win.showOpenFilePicker;
      if (typeof originalShowSave === 'function') {
        win.showSaveFilePicker = async options => new Promise((resolve, reject) => {
          const name = safeName(options && options.suggestedName || 'Untitled.txt');
          showDialog('save', {name}, {
            cancel: () => reject(new DOMException('The user aborted a request.', 'AbortError')),
            os: () => originalShowSave.call(win, options).then(resolve, reject),
            virtual: () => {
              let chunks = [];
              const handle = {
                kind: 'file', name,
                createWritable: async () => ({
                  write: async data => {
                    if (data instanceof Blob) chunks.push(data);
                    else if (data && data.type === 'write') chunks.push(data.data instanceof Blob ? data.data : new Blob([data.data]));
                    else if (data && data.type === 'truncate') chunks = [];
                    else chunks.push(new Blob([data]));
                  },
                  close: async () => {
                    const blob = new Blob(chunks);
                    showFileBrowser('save', {name, type:blob.type, getBlob:async()=>blob}, () => resolve(handle));
                  },
                  abort: async () => { chunks=[]; }
                }),
                getFile: async () => {
                  await dbReady;
                  const r = readFiles().find(x => x.name === name);
                  if (!r) throw new DOMException('File not found', 'NotFoundError');
                  return new File([r.blob], r.name, {type:r.type,lastModified:r.modified});
                }
              };
              resolve(handle);
            }
          });
        });
      }
      if (typeof originalShowOpen === 'function') {
        win.showOpenFilePicker = async options => new Promise((resolve, reject) => {
          showDialog('open', {}, {
            cancel: () => reject(new DOMException('The user aborted a request.', 'AbortError')),
            os: () => originalShowOpen.call(win, options).then(resolve, reject),
            virtual: () => showFileBrowser('open', {input:{accept:(options && options.types || []).flatMap(t=>t.accept?Object.values(t.accept).flat():[]).join(',')}}, async file => {
              const h = {kind:'file',name:file.name,getFile:async()=>file};
              resolve([h]);
            })
          });
        });
      }
    } catch (_) {}
    doc.querySelectorAll('input[type="file"]').forEach(i => patchInput(i, win));
    doc.querySelectorAll('a[download],a[href^="blob:"],a[href^="data:"]').forEach(a => patchAnchor(a, win));
    const mo = new win.MutationObserver(records => {
      for (const r of records) for (const n of r.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches && n.matches('input[type="file"]')) patchInput(n, win);
        if (n.matches && n.matches('a[download],a[href^="blob:"],a[href^="data:"]')) patchAnchor(n, win);
        n.querySelectorAll && n.querySelectorAll('input[type="file"]').forEach(i => patchInput(i, win));
        n.querySelectorAll && n.querySelectorAll('a[download],a[href^="blob:"],a[href^="data:"]').forEach(a => patchAnchor(a, win));
      }
    });
    observers.add(mo);
    mo.observe(doc.documentElement, {childList:true,subtree:true});
    win.__mpcFileRouterObserver = mo;
  }

  function scan() {
    let doc;
    try { doc = mpc.doc(); } catch (_) { return; }
    doc.querySelectorAll('iframe.win-frame, .app-win iframe, iframe').forEach(frame => {
      try { if (frame.contentWindow) patchWindow(frame.contentWindow); } catch (_) {}
    });
  }

  // Public helper for other plugins/apps to access the virtual file store.
  // list()/get() wait for the IndexedDB load to finish; put()/remove() are
  // async since they now go through an IndexedDB transaction.
  window.MPCSIM_FILES = {
    async list() {
      await dbReady;
      return readFiles().map(({id,name,type,size,modified}) => ({id,name,type,size,modified}));
    },
    async get(name) {
      await dbReady;
      const f = readFiles().find(x => x.name === name);
      return f ? new File([f.blob], f.name, {type:f.type,lastModified:f.modified}) : null;
    },
    async put(name, blob) {
      await dbReady;
      return putFile(fileToRecord(blob, name));
    },
    async remove(name) {
      await dbReady;
      return removeFileByName(name);
    }
  };

  scan();
  scanTimer = mpc.interval(scan, 700);
  mpc.onStop(() => {
    if (scanTimer) clearInterval(scanTimer);
    observers.forEach(mo => { try { mo.disconnect(); } catch (_) {} });
    try { const d = mpc.doc(); const el=d.getElementById(DIALOG_ID); if(el)el.remove(); const st=d.getElementById(STYLE_ID);if(st)st.remove(); } catch (_) {}
    try { delete window.MPCSIM_FILES; } catch (_) {}
  });
  mpc.notify('MPCSIM File Router enabled.');
})();
