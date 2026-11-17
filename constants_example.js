/* ══════════════════════════════════
   CONSTANTS
══════════════════════════════════ */
const base = '';
const ACCENT_COLORS = [''];
const BG_COLORS = ['#'];
const TILE_COLORS = ['#'];
const PATTERNS = ['None'];
// Hardcoded preset wallpapers — edit/add entries here to customize the gallery shown in Personalize.
const WALLPAPER_PRESETS = [
  {name:'',   url:'.'},
];

/* ══════════════════════════════════
   DEFAULT STATE
══════════════════════════════════ */
const THEMES={
  defaultnew:{name:'Default (new)',previews:['./preview/defaultnew.png'],orb:'fa-solid fa-grip',panel:false,alias:['new','defaultnew']},
  default:{name:'Default (classic)',previews:['./preview/defaultolddesktop.png','./preview/defaultoldstart.png'],orb:'fa-solid fa-grip',panel:false,startBg:true,alias:[]},
  win11:{name:'Windows 11',previews:['./preview/w11.png'],orb:'fa-brands fa-windows',panel:true,alias:['windows11','w11']},
  win10:{name:'Windows 10',previews:['./preview/w10.png'],orb:'fa-brands fa-windows',panel:true,alias:['windows10','w10']},
  win7:{name:'Windows 7',previews:['./preview/w7.png'],orb:'fa-brands fa-windows',panel:true,alias:['windows7','w7']},
  mac:{name:'macOS',previews:['./preview/macosdesktop.png','./preview/macosstart.png'],orb:'fa-solid fa-rocket',panel:false,alias:['macos','osx','apple']},
  gnome:{name:'GNOME',previews:['./preview/gnomedesktop.png','./preview/gnomestart.png'],orb:'fa-solid fa-circle',panel:false,alias:['linux']},
  chromeos:{name:'ChromeOS',previews:['./preview/chromeos.png'],orb:'fa-solid fa-circle',panel:true,alias:['chrome','chromebook']},
};
const DEFAULT_APPS = [
  /* ── Web ── */
  {
    id: 'app-suggest',
    name: 'Suggest: Want more? Suggest more.',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSemCGt2Ukhjqpyy_msSgjqb_nt9FsY-yQsPZLC9YqPpAS891Q/viewform?usp=dialog',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/10782/10782398.png',
    resolution: 100
  },
];
const DEFAULT_TILES = [
  {id:'tl0',appId:'app-suggest', size:'small',   group:'Apps',        color:'#2d7d9a'},

];
const DEFAULT_DICONS = [
  {id:'di1',appId:'app-suggest'},
];
const DEFAULT_GROUPS = ['Apps'];