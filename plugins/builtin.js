/* Hardcoded plugin list — shared by mpcsim (boot-time autostart) and the Plugins app.
   Paths are relative to the main mpcsim page. Set autostart:true to run at boot.
   hasApp:true just labels plugins that bundle an app (via mpc.addApp).
   (Users can also toggle autostart per plugin from the Plugins app's right-click menu.) */
window.MPC_BUILTIN_PLUGINS=[
  {id:'hello',  name:'Hello World',    desc:'Shows a notification. Good for testing plugins.',                   path:'./plugins/js/hello.js',   icon:'fa-solid fa-hand',           color:'#0078d4', autostart:false},
  {id:'rainbow',name:'Rainbow Accent', desc:'Cycles the accent colour. Stop it to restore.',                     path:'./plugins/js/rainbow.js', icon:'fa-solid fa-palette',        color:'#0078d4', autostart:false},
  {id:'notes',  name:'Notes',          desc:'Bundles a Notes app. Running installs it, stopping removes it.',    path:'./plugins/js/notes.js',   icon:'fa-solid fa-note-sticky',    color:'#0078d4', autostart:false, hasApp:true},
  {id:'winctl', name:'Window Controls',desc:'Bundles an app to enable/disable window buttons, for normal and 1-app mode windows.', path:'./plugins/js/winctl.js', icon:'fa-solid fa-window-restore', color:'#0078d4', autostart:false, hasApp:true},
  {id:'localfiles', name:'Local Files', desc:'Save and open files inside your apps. Files are stored locally in your browser.', path:'./plugins/js/localfiles.js', icon:'fa-solid fa-folder-open', color:'#0078d4', autostart:true, hasApp:true},
  {id:'bootanim', name:'Boot Animation Changer'    ,desc:'Change the boot animation. (immediate start needed)',                               path:'./plugins/js/bootanim.js', icon:'fa-solid fa-folder-open', color:'#0078d4', autostart:false, hasApp:true},
];
