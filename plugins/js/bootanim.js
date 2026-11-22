// ═══════════════════════════════════════════════════════════════════════════
//  Boot Animation  —  choose the video for each boot step, or turn a step off
// ═══════════════════════════════════════════════════════════════════════════
//  Boot steps (normal boot):  START (plays once) → LOOP (loops while loading) → END (plays once)
//  Quick boot with video on:  only END plays.
//
//  HOW TO USE
//   1. Import this file in the Plugins app and run it.
//   2. Right-click its tile → "Start immediately at boot…". The boot videos are
//      loaded at the very start of boot, so this plugin has to run before that.
//      (Autostart is too late: the videos are already loaded by then.)
//   3. Open the "Boot Animation" app (it is installed while this plugin runs),
//      pick a video for each step or switch the step off.
//   Changes apply on the NEXT boot.
//
//  ADDING YOUR OWN OPTIONS
//   Add entries to OPTIONS below: { id: 'unique-id', name: 'Shown in the list', path: './your-file.mp4' }
//   The first entry of each step is the default. If a file is missing, that step
//   is simply skipped during boot (same as the built-in behaviour).
// ═══════════════════════════════════════════════════════════════════════════

const OPTIONS = {
  start: [
    { id: 'default', name: 'Default start video', path: './boot_start.mp4' },
    { id: 'alt1',    name: 'Default loop video', path: './boot_loop.mp4' },
    { id: 'alt2',    name: 'Default end video', path: './boot_end.mp4' },
  ],
  loop: [
    { id: 'default', name: 'Default loop video', path: './boot_loop.mp4' },
    { id: 'alt1',    name: 'Default start video', path: './boot_start.mp4' },
    { id: 'alt2',    name: 'Default end video', path: './boot_end.mp4' },
  ],
  end: [
    { id: 'default', name: 'Default end video', path: './boot_end.mp4' },
    { id: 'alt1',    name: 'Default start video', path: './boot_start.mp4' },
    { id: 'alt2',    name: 'Default loop video', path: './boot_loop.mp4' },
  ],
};

const STEPS = [
  { key: 'start', title: 'Start video', desc: 'Plays once at the very start of a normal boot.' },
  { key: 'loop',  title: 'Loop video',  desc: 'Loops while mpcsim loads. With no start video it is the first thing shown.' },
  { key: 'end',   title: 'End video',   desc: 'Plays once when loading is done, right before the lock screen. Also used by quick boot.' },
];

const host = mpc.host;
const STORE_KEY = 'mpc_bootanim';
const guest = () => { try { return !!host.BOOT.guest; } catch (e) { return false; } };

/* ── settings ── */
const defaults = () => ({ start: { on: true, opt: 'default' }, loop: { on: true, opt: 'default' }, end: { on: true, opt: 'default' } });
let cfg = defaults();
function load() {
  cfg = defaults();
  if (guest()) return;                       // guest sessions never read or write saved settings
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && typeof s === 'object') STEPS.forEach(({ key }) => {
      const c = s[key];
      if (c && typeof c === 'object') cfg[key] = { on: c.on !== false, opt: typeof c.opt === 'string' ? c.opt : 'default' };
    });
  } catch (e) {}
}
function save() {
  if (guest()) return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(cfg)); } catch (e) { mpc.log('Could not save: ' + e.message); }
}
function option(step) {
  const list = OPTIONS[step] || [];
  return list.find(o => o.id === cfg[step].opt) || list[0] || null;
}
load();

/* ── hook the boot video loader ──
   The boot code loads each video through bootLoadVid(element, path, setOK).
   Swap the path for the chosen one, or report "no video" for a step that is off;
   the normal boot code already knows how to carry on without a video. */
const origLoad = host.bootLoadVid;
const stepFor = (v, url) => {
  try {
    if (v === bootStartVideo) return 'start';
    if (v === bootVideo) return 'loop';
    if (v === bootEndVideo) return 'end';
  } catch (e) {}
  try {
    if (url === BOOT_START_VIDEO) return 'start';
    if (url === BOOT_LOOP_VIDEO) return 'loop';
    if (url === BOOT_END_VIDEO) return 'end';
  } catch (e) {}
  return null;
};
const hook = function (v, url, setOK) {
  const step = stepFor(v, url);
  if (!step) return origLoad.apply(this, arguments);
  if (!cfg[step].on) {
    mpc.log('Boot ' + step + ' video: off');
    try { setOK(false); } catch (e) {}
    return Promise.resolve();
  }
  const o = option(step);
  const path = o ? o.path : url;
  if (path !== url) mpc.log('Boot ' + step + ' video: ' + (o ? o.name : path) + ' (' + path + ')');
  return origLoad.call(this, v, path, setOK);
};
if (typeof origLoad === 'function') {
  host.bootLoadVid = hook;
} else {
  mpc.log('bootLoadVid not found: this mpcsim version is not supported.');
}

/* Did this plugin start early enough to affect the current boot? */
let early = false;
try { early = ['click', 'grace', 'load'].includes(bootPhase); } catch (e) {}
if (!early) mpc.notify('Boot Animation: started after boot. Turn on "Start immediately at boot" for it, then the settings apply from the next boot.');

/* ── API used by the settings app ── */
host.MPC_BOOTANIM = {
  steps: STEPS,
  options: OPTIONS,
  get: () => JSON.parse(JSON.stringify(cfg)),
  pathOf: step => { const o = option(step); return o ? o.path : ''; },
  set: (step, patch) => {
    if (!cfg[step]) return;
    if (patch && typeof patch.on === 'boolean') cfg[step].on = patch.on;
    if (patch && typeof patch.opt === 'string' && (OPTIONS[step] || []).some(o => o.id === patch.opt)) cfg[step].opt = patch.opt;
    save();
  },
  reset: () => { cfg = defaults(); save(); },
  accent: () => { try { return mpc.S().accent; } catch (e) { return '#0078d4'; } },
  early: () => early,
  guest,
};

/* ── settings app ── */
const APP_HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Boot Animation</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--accent:#0078d4}
html,body{height:100%;background:#1a1a1a;color:#fff;font-family:'Segoe UI',sans-serif}
body{padding:22px 28px;overflow-y:auto}
h1{font-size:30px;font-weight:200;letter-spacing:-.5px}
.sub{font-size:12px;color:#888;margin:2px 0 16px;font-weight:300}
.banner{font-size:12px;line-height:1.55;padding:9px 12px;margin-bottom:14px;background:#2a2a2a;border-left:3px solid var(--accent);color:#ccc}
.banner.warn{border-left-color:#ff8c00;color:#ffb35c}
.card{background:#242424;border-top:2px solid var(--accent);padding:14px 16px;margin-bottom:10px}
.card.off .pick{opacity:.35;pointer-events:none}
.top{display:flex;align-items:center;gap:12px}
.top .t{font-size:15px;font-weight:600;flex:1}
.d{font-size:12px;color:#999;margin:2px 0 10px}
.sw{display:flex;align-items:center;gap:8px;font-size:12px;color:#ccc;cursor:pointer;user-select:none}
.sw input{width:16px;height:16px;accent-color:var(--accent);cursor:pointer}
select{width:100%;background:#1a1a1a;border:1px solid #444;border-bottom:2px solid var(--accent);color:#eee;padding:8px 10px;font:13px 'Segoe UI',sans-serif;outline:none}
.path{font:12px Consolas,monospace;color:#888;margin-top:6px;word-break:break-all}
.row{display:flex;gap:8px;align-items:center;margin-top:14px}
.btn{background:#2d2d2d;border:none;border-bottom:2px solid #444;color:#fff;padding:8px 14px;font:13px 'Segoe UI',sans-serif;cursor:pointer}
.btn:hover{background:#3a3a3a;border-bottom-color:var(--accent)}
.msg{font-size:12px;color:#7fd962;margin-left:6px}
</style></head>
<body>
<h1>Boot Animation</h1>
<div class="sub">Choose the video for each boot step, or switch a step off. Changes apply on the next boot.</div>
<div id="banner"></div>
<div id="cards"></div>
<div class="row"><button class="btn" id="reset">Reset to defaults</button><span class="msg" id="msg"></span></div>
<script>
function findAPI(){
  var w=window;
  for(var i=0;i<8;i++){
    try{
      if(w.MPC_BOOTANIM)return w.MPC_BOOTANIM;
      if(w===w.parent)break;
      w=w.parent;
    }catch(e){break;}
  }
  return null;
}
var api=findAPI();
var msgEl=document.getElementById('msg'),msgT=null;
function flash(t){msgEl.textContent=t;clearTimeout(msgT);msgT=setTimeout(function(){msgEl.textContent='';},2500);}
function render(){
  var cardsEl=document.getElementById('cards'),ban=document.getElementById('banner');
  if(!api){ban.innerHTML='<div class="banner warn">Not connected to the Boot Animation plugin. Make sure the plugin is running.</div>';cardsEl.innerHTML='';return;}
  document.documentElement.style.setProperty('--accent',api.accent());
  var b='';
  if(api.guest())b+='<div class="banner">Guest mode: settings are not saved.</div>';
  if(!api.early())b+='<div class="banner warn">This plugin started after boot began, so the videos are already loaded. Right-click the plugin tile in the Plugins app and turn on <b>Start immediately at boot</b>; your settings then apply from the next boot.</div>';
  ban.innerHTML=b;
  var cfg=api.get();
  cardsEl.innerHTML='';
  api.steps.forEach(function(st){
    var c=cfg[st.key];
    var card=document.createElement('div');card.className='card'+(c.on?'':' off');
    var top=document.createElement('div');top.className='top';
    var t=document.createElement('div');t.className='t';t.textContent=st.title;
    var lab=document.createElement('label');lab.className='sw';
    var cb=document.createElement('input');cb.type='checkbox';cb.checked=c.on;
    lab.appendChild(cb);lab.appendChild(document.createTextNode('Play this step'));
    top.appendChild(t);top.appendChild(lab);
    var d=document.createElement('div');d.className='d';d.textContent=st.desc;
    var pick=document.createElement('div');pick.className='pick';
    var sel=document.createElement('select');
    api.options[st.key].forEach(function(o){
      var op=document.createElement('option');op.value=o.id;op.textContent=o.name;if(o.id===c.opt)op.selected=true;sel.appendChild(op);
    });
    var pth=document.createElement('div');pth.className='path';pth.textContent=api.pathOf(st.key);
    pick.appendChild(sel);pick.appendChild(pth);
    cb.onchange=function(){api.set(st.key,{on:cb.checked});card.classList.toggle('off',!cb.checked);flash(st.title+(cb.checked?' on':' off'));};
    sel.onchange=function(){api.set(st.key,{opt:sel.value});pth.textContent=api.pathOf(st.key);flash('Saved');};
    card.appendChild(top);card.appendChild(d);card.appendChild(pick);
    cardsEl.appendChild(card);
  });
}
document.getElementById('reset').onclick=function(){if(api){api.reset();render();flash('Reset to defaults');}};
render();
<\/script>
</body></html>`;

mpc.addApp({ name: 'Boot Animation', html: APP_HTML });
mpc.log('Boot Animation ready' + (early ? ' (applies to this boot)' : ' (applies from the next boot)'));

/* ── cleanup when the plugin stops ── */
mpc.onStop(() => {
  if (host.bootLoadVid === hook && typeof origLoad === 'function') host.bootLoadVid = origLoad;
  delete host.MPC_BOOTANIM;
});
