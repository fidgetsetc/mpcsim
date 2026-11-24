/* ══════════════════════════════════
   CONSTANTS
══════════════════════════════════ */
const base = 'https://fedoraproject.org/wiki/Special:FilePath/';
const ACCENT_COLORS = ['#0078d4','#1a6ebd','#e74856','#00b294','#00b4d8','#744da9','#e3008c','#107c10','#ff8c00','#d13438','#038387','#2d7d9a','#8e562e','#515151','#ea005e','#4a5568'];
const BG_COLORS = ['#0d1f3c','#1a3a5c','#0f3460','#16213e','#1b4332','#2d0c57','#6d0033','#3a1f00','#1a1a2e','#2c2c2c','#000d1a','#001a00','#1a0000','#1a1700','#0a0a0a','#1e293b'];
const TILE_COLORS = ['#0078d4','#107c10','#e81123','#744da9','#e3008c','#ff8c00','#00b294','#038387','#d13438','#515151','#2d7d9a','#1a6ebd','#00b4d8','#8e562e'];
const PATTERNS = ['None','Waves','Dots','Lines','Squares','Cross'];
// Hardcoded preset wallpapers — edit/add entries here to customize the gallery shown in Personalize.
const WALLPAPER_PRESETS = [
  {name:'MPCSim (1, default)',   url:'./wp/image1.jpg'},
  {name:'MPCSim (2)',   url:'./wp/image2.jpg'},
  {name:'MPCSim (3)',   url:'./wp/image3.jpg'},
  {name:'MPCSim (4)',   url:'./wp/image4.jpg'},
  {name:'MPCSim (5)',   url:'./wp/image5.jpg'},
  {name:'MPCSim (6, crpl)',   url:'./wp/image6.jpg'},
  {name:'MPCSim (7, crpl)',   url:'./wp/image7.jpg'},
  {name:'MPCSim (8, crpl)',   url:'./wp/image8.jpg'},
  {name:'Default (Old)',   url:'./wp/defaultold.png'},
  {name:'Default (Oldest))',   url:'./wp/default.jpg'},
  {name:'w11',   url:'https://4kwallpapers.com/images/wallpapers/windows-11-blue-stock-white-background-light-official-2880x1800-5616.jpg', light:true},
  {name:'w11 dark',   url:'https://blogs.windows.com/wp-content/uploads/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg'},
  {name:'w10',   url:'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dbe7c529-8b07-4e8f-bef5-1372f6322458/dhbsu6k-21251341-8fd6-4a00-a23d-6bb583ca738e.png/v1/fill/w_1131,h_707,q_70,strp/windows_10_22h2_desktop_wallpaper_by_juliegill1993_dhbsu6k-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTIwMCIsInBhdGgiOiIvZi9kYmU3YzUyOS04YjA3LTRlOGYtYmVmNS0xMzcyZjYzMjI0NTgvZGhic3U2ay0yMTI1MTM0MS04ZmQ2LTRhMDAtYTIzZC02YmI1ODNjYTczOGUucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ._cNglkSQY3HkSRzZw-TRlTHPyAzet3yFnTEO6SXH-Fk'},
  {name:'w10 old',   url:'https://wallpapercave.com/wp/wp7283005.jpg'},
  {name:'w8.1', url:'https://wallpapercave.com/wp/wp1922802.jpg'},
    {name:'w8', url:'https://i.redd.it/22xnaa5edht91.png'},
    {name:'w7', url:'https://i.postimg.cc/zB7X1jDq/Wind7-Ult64-img0-SCALE3456x2160.png'},
  {name:'Mountains', url:'https://picsum.photos/seed/win81-mountains/1600/900'},
  {name:'Forest',    url:'https://picsum.photos/seed/win81-forest/1600/900'},
  {name:'Ocean',      url:'https://picsum.photos/seed/win81-ocean/1600/900'},
  {name:'Desert',     url:'https://picsum.photos/seed/win81-desert/1600/900'},
  {name:'City Night', url:'https://picsum.photos/seed/win81-citynight/1600/900'},
  {name:'Autumn',     url:'https://picsum.photos/seed/win81-autumn/1600/900'},
  {name:'Abstract',   url:'https://picsum.photos/seed/win81-abstract/1600/900'},
  {name:'Minimal',    url:'https://picsum.photos/seed/win81-minimal/1600/900'},
  {name:'Snow',       url:'https://picsum.photos/seed/win81-snow/1600/900'},
  {name:'Space',      url:'https://picsum.photos/seed/win81-space/1600/900'},
    { name: 'f45-day', url: 'https://images.squarespace-cdn.com/content/v1/5c1c4f1ce2ccd162f0621944/57d49b5d-9ce3-4cdb-b221-4ac269846f32/F45-wallpaper-day-96dpi.png' },
    { name: 'f45-night', url: 'https://images.squarespace-cdn.com/content/v1/5c1c4f1ce2ccd162f0621944/1ae739c9-0c67-43ee-ab5e-78b7404cc04d/F45-wallpaper-night-96dpi.png' },
    { name: 'f44-day', url: base + 'F44-wallpaper_day_(small).png?width=1600' },
{ name: 'f44-night', url: base + 'F44-wallpaper_night_(small).png?width=1600' },

{ name: 'f43-day', url: base + 'F43-DAY_final_day_(small).png?width=1600' },
{ name: 'f43-night', url: base + 'F43-DAY_final_night_(small).png?width=1600' },

{ name: 'f42-day', url: base + 'F42-01-day.jpg?width=1600' },
{ name: 'f42-night', url: base + 'F42-01-night.jpg?width=1600' },

{ name: 'f41-day', url: base + 'F41-01-day.jpg?width=1600' },
{ name: 'f41-night', url: base + 'F41-01-night.jpg?width=1600' },

{ name: 'f40-day', url: base + 'F40-01-day-compressed.png?width=1600' },
{ name: 'f40-night', url: base + 'F40-01-night-compressed.png?width=1600' },

{ name: 'f39-day', url: base + 'F3901-day.png?width=1600' },
{ name: 'f39-night', url: base + 'F39night.jpg?width=1600' },

{ name: 'f38-day', url: base + 'F38-01-day.jpg?width=1600' },
{ name: 'f38-night', url: base + 'F38-01-night.jpg?width=1600' },

{ name: 'f37-day', url: base + 'F37-01-day.jpg?width=1600' },
{ name: 'f37-night', url: base + 'F37-01-night.jpg?width=1600' },

{ name: 'f36-day', url: base + 'F36-01-day.jpg?width=1600' },
{ name: 'f36-night', url: base + 'F36-02-night.jpg?width=1600' },

{ name: 'f35-day', url: base + 'F35-01-day.png?width=1600' },
{ name: 'f35-night', url: base + 'F35-02-night.png?width=1600' },

{ name: 'f34-day', url: base + 'F34_default_wallpaper_day.jpg?width=1600' },
{ name: 'f34-night', url: base + 'F34_default_wallpaper_night.jpg?width=1600' },

{ name: 'f33-dawn', url: base + 'F33_defaut_wallpaper_dawn.jpg?width=1600' },
{ name: 'f33-day', url: base + 'F33_default_wallpaper_day.jpg?width=1600' },
{ name: 'f33-dusk', url: base + 'F33_wallpaper_dusk.jpg?width=1600' },
{ name: 'f33-night', url: base + 'F33_wallpaper_night.jpg?width=1600' },

{ name: 'f32-dawn', url: base + 'F32_defaut_wallpaper_dawn.png?width=1600' },
{ name: 'f32-day', url: base + 'F32_default_wallpaper_day.png?width=1600' },
{ name: 'f32-dusk', url: base + 'F32_wallpaper_dusk.png?width=1600' },
{ name: 'f32-twilight', url: base + 'F32_wallpaper_twilight.png?width=1600' },

{ name: 'f31', url: base + 'F31_wallpaper.png?width=1600' },

{ name: 'f30-dawn', url: base + 'F30_wallpaper_dawn.png?width=1600' },
{ name: 'f30-day', url: base + 'F30_wallpaper_day.png?width=1600' },
{ name: 'f30-sunset', url: base + 'F30_wallpaper_sunset.png?width=1600' },
{ name: 'f30-twilight', url: base + 'F30_wallpaper_twilight.png?width=1600' },

{ name: 'f29-beta', url: base + 'F29_wallpaper_beta.png?width=1600' },

{ name: 'f28', url: base + 'F28-wallpaper-final.png?width=1600' },

{ name: 'f27', url: base + 'Fedora-27-wallpaper.png?width=1600' },

{ name: 'f26', url: base + 'F26-final-day-default-wallpaper-standard.png?width=1600' },

{ name: 'f25', url: base + 'Fedora-25-wallpaper.png?width=1600' },

{ name: 'f24', url: base + 'F24-standard_wiki.png?width=1600' },

{ name: 'f23', url: base + 'F23.jpg?width=1600' },

{ name: 'f22', url: base + 'F22.jpg?width=1600' },

{ name: 'f21', url: base + 'F21.png?width=1600' },

{ name: 'f20-alpha', url: base + 'F20-alpha-wallpaper-standard.png?width=1600' },

{ name: 'f19-alpha-dawn', url: base + 'f19-alpha-wallpaper-dawn.png?width=1600' },
{ name: 'f19-alpha-day', url: base + 'f19-alpha-wallpaper-day.png?width=1600' },
{ name: 'f19-alpha-dusk', url: base + 'f19-alpha-wallpaper-dusk.png?width=1600' },
{ name: 'f19-alpha-night', url: base + 'f19-alpha-wallpaper-night.png?width=1600' },

{ name: 'f18-alpha', url: base + 'F18-alpha-wallpaper-standard.png?width=1600' },

{ name: 'f17-final', url: base + 'f17-final-wallpaper-standard.png?width=1600' },

{ name: 'f16-alpha', url: base + 'f16-alpha-wallpaper-standard.png?width=1600' },

{ name: 'f15-nongnome', url: base + 'F15-wallpaper-default.png?width=1600' },
{ name: 'f15-gnome', url: base + 'F15-wallpaper-gnome.png?width=1600' },

{ name: 'f14-final', url: base + 'F14-final-wallpaper-updated.png?width=1600' },

{ name: 'f13-mockup', url: base + 'Kyles-mockup-2.jpg?width=1600' },

{ name: 'f12', url: base + 'F12-80-wide.png?width=1600' },

{ name: 'f11', url: base + 'King_4096x1536.png?width=1600' },

{ name: 'f10-solar', url: base + 'solar_Wallpaper_2048x1536.jpg?width=1600' },

{ name: 'f9-sunrise', url: base + 'F9-wallpaper-waves-normal-0-morn.png?width=1600' },
{ name: 'f9-day', url: base + 'F9-wallpaper-waves-normal-1-noon.png?width=1600' },
{ name: 'f9-sunset', url: base + 'F9-wallpaper-waves-normal-2-evening.png?width=1600' },
{ name: 'f9-night', url: base + 'F9-wallpaper-waves-normal-3-night.png?width=1600' },

{ name: 'f8-day', url: base + 'f8-wallpaper-day.png?width=1600' },
{ name: 'f8-morning', url: base + 'f8-wallpaper-morning.png?width=1600' },
{ name: 'f8-sunset', url: base + 'f8-wallpaper-sunset.png?width=1600' },
{ name: 'f8-night', url: base + 'f8-wallpaper-night.png?width=1600' },

{ name: 'f7', url: base + 'fc7-wallpaper.png?width=1600' },
{ name: 'f7-5-4', url: base + 'fc7-wallpaper-54.png?width=1600' },
{ name: 'f7-wide', url: base + 'fc7-wallpaper-wide.png?width=1600' },

{ name: 'fc6', url: base + 'fc6-wallpaper.png?width=1600' },
{ name: 'fc6-5-4', url: base + 'fc6-wallpaper-54.png?width=1600' },
{ name: 'fc6-wide', url: base + 'fc6-wallpaper-wide.png?width=1600' },
{ name: 'fc6-dual', url: base + 'fc6-wallpaper-dual.png?width=1600' },
{ name: 'fc6-dualwide', url: base + 'fc6-wallpaper-dualwide.png?width=1600' },

{ name: 'fc5', url: base + 'fc5-wallpaper.png?width=1600' },

{ name: 'fc3/4', url: base + 'fc4-wallpaper.png?width=1600' },

{ name: 'fc2', url: base + 'fc2-wallpaper.png?width=1600' },

{ name: 'fc1', url: base + 'fc1-wallpaper.png?width=1600' },
{name:'d13',      url:'./wp/d13.svg'},
  {name:'d12', url:'./wp/d12.png'},
  {name:'d11',    url:'./wp/d11.png'},
  {name:'d10',      url:'./wp/d10.svg'},
  {name:'d9',     url:'./wp/d9.svg'},
  {name:'d8', url:'./wp/d8.svg'},
  {name:'d7',     url:'./wp/d7.png'},
  {name:'d6',   url:'./wp/d6.svg'},
  {name:'d5',   url:'./wp/d5.png'},
  {name:'d4',       url:'./wp/d4.jpg'},
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
  {
    id: 'app-mo',
    name: 'Mascot Opinion: Leave your opinion on our mascot.',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSf0SkNePsWoWq-y-ldfQs8bHRyyeJmuM4I_1GOBMtOCQ1o2lg/viewform?usp=publish-editor',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './img/mascotidk.png',
    resolution: 100
  },
  {
    id: 'app-ie',
    name: 'Internet',
    url: './browse/index.html',
    icon: 'edge',
    cat: 'Web',
    iconUrl: 'https://static.wikia.nocookie.net/logopedia/images/b/ba/MicrosoftEdge_2015appIcon.svg',
    resolution: 100
  },

  /* ── Office ── */
  {
    id: 'app-ppt',
    name: 'PPTX Maker (DeckCraft, like PowerPoint)',
    url: './ppt/index.html',
    icon: 'file-powerpoint',
    cat: 'Office',
    iconUrl: './ppt/deckcraft-b8fcbb36ecec0385.ico',
    resolution: 100
  },
  {
    id: 'app-doc',
    name: 'DOCX Maker (WordCraft, like Word)',
    url: './doc/index.html',
    icon: 'gear',
    cat: 'Office',
    iconUrl: './doc/wordcraft-fa59e09a3f921e03.ico',
    resolution: 100
  },
  {
    id: 'app-edit',
    name: 'Video Editor',
    url: './edit/index.html',
    icon: 'gear',
    cat: 'Office',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6979/6979672.png',
    resolution: 80
  },
  {
    id: 'app-isweartogodifyoufindthenotebookhotiwilldisinegrateyou',
    name: 'MyDraw',
    url: './mydraw/index.html',
    icon: 'image',
    cat: 'Tools',
    iconUrl: './mydraw/index.png',
    resolution: 100
  },
  /* ── Entertainment ── */
  {
    id: 'app-yt',
    name: 'YouTube',
    url: './tube/index.html',
    icon: 'youtube',
    cat: 'Entertainment',
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhy32aF9Osqt7wk4B_rfhG5StGPvBfEkB471DZSiHQ_Q&s=10',
    resolution: 100
  },
  {
    id: 'app-book',
    name: 'Reader',
    url: './read/index.html',
    icon: 'book',
    cat: 'Entertainment',
    iconUrl: '',
    resolution: 100
  },

  /* ── Tools ── */
  {
    id: 'app-calc',
    name: 'Calculator',
    url: './calc/index.html',
    icon: 'calculator',
    cat: 'Tools',
    iconUrl: 'https://i5.walmartimages.com/asr/2f493faf-12b9-454e-8d7f-aea81de40e6f.d91932f59c2d53b60f1d7c3c7e619fb3.jpeg',
    resolution: 80
  },
  {
    id: 'app-tts',
    name: 'Text to Speech',
    url: './tts/index.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5256/5256064.png',
    resolution: 100
  },
  {
    id: 'app-xwp',
    name: 'Extra Wallpapers',
    url: './extrawp/index.html',
    icon: 'image',
    cat: 'Tools',
    iconUrl: '',
    resolution: 100
  },
  {
    id: 'app-plug',
    name: 'Plugins',
    url: './plugins/index.html',
    icon: 'puzzle',
    cat: 'Tools',
    iconUrl: '',
    resolution: 100
  },

  /* ── System ── */
  {
    id: 'app-set',
    name: 'Settings',
    url: '',
    icon: 'gear',
    cat: 'System',
    iconUrl: 'https://static.wikia.nocookie.net/logopedia/images/4/46/Settings_Windows_8.svg/',
    resolution: 100
  },
  {
    id: 'app-desk',
    name: 'Desktop',
    url: '__desktop__',
    icon: 'desktop',
    cat: 'System',
    iconUrl: '',
    resolution: 100
  },
  {
    id: 'app-term',
    name: 'Terminal',
    url: '__terminal__',
    icon: 'terminal',
    cat: 'System',
    iconUrl: '',
    resolution: 100
  },
  {
    id:'app-task', 
    name:'Task Manager', 
    url:'__taskmgr__', 
    icon:'chart', 
    cat:'System'
  },

  /* ── Chat ── */
  {
    id: 'app-ai',
    name: 'AI Chat',
    url: './ai/index.html',
    icon: 'gear',
    cat: 'Chat',
    iconUrl: 'https://assets.streamlinehq.com/image/private/w_240,h_240,ar_1/f_auto/v1/icons/ai-actions/ai-chat-spark-gqpotmo80h88iytqljg4o9.png/ai-chat-spark-n76s7ehrah2tdmhwoxso9.png?_a=DATAiZAAZAA0',
    resolution: 100
  },

  /* ── Fun ── */
  {
    id: 'app-crash',
    name: 'Window Avalanche',
    url: '__physics__',
    icon: 'bolt',
    cat: 'Fun',
    iconUrl: '',
    resolution: 100
  },

  /* ── Games: existing standalone apps ── */
  {
    id: 'app-mc112',
    name: 'MC 1.12',
    url: './mc/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-coghtBjhY3r1o6nz6TjaZMbOxCrwgxQjscBs0heEpA&s=10',
    resolution: 100
  },
  {
    id: 'app-mc262',
    name: 'MC 26.2',
    url: './mc/262/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-coghtBjhY3r1o6nz6TjaZMbOxCrwgxQjscBs0heEpA&s=10',
    resolution: 100
  },
  {
    id: 'app-mcsm',
    name: 'MC Story Mode',
    url: './mc/sm/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './mc/sm/index.png',
    resolution: 100
  },
  {
    id: 'app-1v1lol',
    name: '1v1.lol',
    url: './1v1lol/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './1v1lol/index.png',
    resolution: 100
  },
  {
    id: 'app-ab',
    name: 'Angry Birds SWF',
    url: './ab/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: 'https://static.wikia.nocookie.net/angrybirds/images/9/98/Angry_Birds_Original_2009_Icon.svg',
    resolution: 100
  },
  {
    id: 'app-au',
    name: 'Among Us',
    url: './gplay-tmp/html/scratchget/index.html?id=523967150',
    icon: 'gear',
    cat: 'Games',
    iconUrl: 'https://static.wikia.nocookie.net/among-us-wiki/images/8/84/Among_Us.png/',
    resolution: 100
  },
  {
    id: 'app-bp',
    name: 'Bad Piggies',
    url: './bp/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: 'https://play-lh.googleusercontent.com/iXET8vmU1PZJ5BepnivZ7016tDgxhmNZUXc6xN8nbimnRl_-jWvmtONxS5Y069JshzKKZgZPIZ4S4u0URySLEQ',
    resolution: 100
  },
  {
    id: 'app-brp',
    name: 'Brick',
    url: './brickplus/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './big-tmp/playing/img/brick.png',
    resolution: 100
  },
  {
    id: 'app-block-blast',
    name: 'Block Blast',
    url: './bb2/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './big-tmp/playing/img/bb.webp',
    resolution: 100
  },
  {
    id: 'app-dm',
    name: 'DuckMath',
    url: './dm/sug.html?back=1',
    icon: 'gear',
    cat: 'Games',
    iconUrl: 'https://avatars.fastly.steamstatic.com/6323b1e849243967b1c201993581ce6065e1b740_full.jpg',
    resolution: 100
  },
  {
    id: 'app-gn',
    name: 'GNMath',
    url: './gn/sug.html?back=1',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './gn/index.png',
    resolution: 100
  },

  /* ── Games from gplay-tmp ── */
  {
    id: 'app-sb',
    name: 'Soccer Bros',
    url: './sb/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './sb/index.png',
    resolution: 100
  },
  {
    id: 'app-baseb',
    name: 'Baseball Bros',
    url: './gplay-tmp/html/baseb/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/baseb.png',
    resolution: 100
  },
  {
    id: 'app-basket-bros',
    name: 'Basket Bros',
    url: './gplay-tmp/html/bb/index.html?h',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/bb.png',
    resolution: 100
  },
  {
    id: 'app-fob',
    name: 'Football Bros',
    url: './gplay-tmp/html/fob/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/fob.png',
    resolution: 100
  },
  {
    id: 'app-ctr',
    name: 'Cut the Rope',
    url: './gplay-tmp/html/ctr/resize/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/ctr.png',
    resolution: 100
  },
  {
    id: 'app-dd4',
    name: 'Droistroy 4',
    url: './gplay-tmp/html/dd4/index.html?basic',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './big-tmp/playing/img/dd4.png',
    resolution: 100
  },
  {
    id: 'app-gdo',
    name: 'Geometry Dash (Real, longer load)',
    url: './gplay-tmp/html/gd/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/gd.png',
    resolution: 100
  },
  {
    id: 'app-gdr',
    name: 'Geometry Dash (Remake, shorter load)',
    url: './big-tmp/playing/html/gd/inder.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/gd.png',
    resolution: 100
  },
  {
    id: 'app-slope',
    name: 'Slope',
    url: './gplay-tmp/html/slope/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/slope.png',
    resolution: 100
  },
  {
    id: 'app-sm',
    name: 'Slice Master',
    url: './gplay-tmp/html/sm/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/sm.png',
    resolution: 100
  },
  {
    id: 'app-tif',
    name: 'Tiny Fishing',
    url: './gplay-tmp/html/tif/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/tif.png',
    resolution: 100
  },
  {
    id: 'app-gs',
    name: 'Google Snake',
    url: './gplay-tmp/html/gs/resize/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/gs.png',
    resolution: 100
  },

  /* ── Additional games from HARDCODED_GAMES ── */
  {
    id: 'app-fb',
    name: 'Flappy Bird',
    url: './gplay-tmp/html/scratchget/index.html?id=1376043784',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/fb.jpg',
    resolution: 100
  },
  {
    id: 'app-cc1',
    name: 'Cookie Clicker',
    url: './dm/index.html#/class/cookie-clicker',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/cc1.webp',
    resolution: 100
  },
  {
    id: 'app-db',
    name: 'Drift Boss',
    url: './dm/index.html#/class/drift-boss',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/db.webp',
    resolution: 100
  },
  {
    id: 'app-r1',
    name: 'Run 1',
    url: './gplay-tmp/html/r1/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/run.png',
    resolution: 100
  },
  {
    id: 'app-r2',
    name: 'Run 2',
    url: './gplay-tmp/html/r2/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/r2.png',
    resolution: 100
  },
  {
    id: 'app-r3',
    name: 'Run 3',
    url: './dm/index.html#/class/run-3',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/r3.png',
    resolution: 100
  },
  {
    id: 'app-chess-ai',
    name: 'Chess AI',
    url: './gplay-tmp/html/scratchget/index.html?id=148769358',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/chess.jpg',
    resolution: 100
  },
  {
    id: 'app-bloxorz',
    name: 'Bloxorz',
    url: './gplay-tmp/html/blo/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/blo.png',
    resolution: 100
  },
  {
    id: 'app-smb',
    name: 'Mario Bros',
    url: './dm/index.html#/class/super-mario-bros',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/smb.ico',
    resolution: 100
  },
  {
    id: 'app-smb3',
    name: 'Mario Bros 3',
    url: './gplay-tmp/html/scratchget/index.html?id=396544900',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/smb3.png',
    resolution: 100
  },
  {
    id: 'app-mm',
    name: 'Megaman',
    url: './gplay-tmp/html/scratchget/index.html?id=26274285&mm',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/mm.png',
    resolution: 100
  },
  {
    id: 'app-uno',
    name: 'UNO!',
    url: './dm/index.html#/class/uno',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/uno.webp',
    resolution: 100
  },
  {
    id: 'app-jj',
    name: 'Jetpack Joyride',
    url: './dm/index.html#/class/jetpack-joyride',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/jj.webp',
    resolution: 100
  },
  {
    id: 'app-cricket',
    name: 'Google Cricket',
    url: './gplay-tmp/html/c/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/c.png',
    resolution: 100
  },
  {
    id: 'app-gso',
    name: 'Google Solitaire',
    url: './gplay-tmp/html/gso/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/gso.png',
    resolution: 100
  },
  {
    id: 'app-gb',
    name: 'Google Baseball',
    url: './gplay-tmp/html/gb/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/gb.png',
    resolution: 100
  },
  {
    id: 'app-pvz',
    name: 'Plants vs Zombies',
    url: './dm/index.html#/class/plants-vs-zombies',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './gplay-tmp/img/pvz.webp',
    resolution: 100
  },

  /* ── Activities ── */

  /* ── Games from big-tmp ── */
  {
    id: 'app-fnf',
    name: 'F-N-F',
    url: './big-tmp/playing/html/fnf/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './big-tmp/playing/img/fnf.webp',
    resolution: 100
  },
  {
    id: 'app-cc',
    name: 'Collab Clicker',
    url: './big-tmp/playing/html/cc/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './big-tmp/playing/img/cc.png',
    resolution: 100
  },
  {
    id: 'app-yio',
    name: 'YellItOut',
    url: './big-tmp/playing/html/yio/index.html?x=1',
    icon: 'gamepad',
    cat: 'Tools',
    iconUrl: './big-tmp/playing/img/yio.png',
    resolution: 100
  },
  {
    id: 'app-abe',
    name: 'Angry Birds Epic',
    url: './abe/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: 'https://cdn.jsdelivr.net/gh/daknux/covers@main/208.png',
    resolution: 100
  },
  {
    id: 'app-ab2',
    name: 'Angry Birds 2',
    url: './ab2/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: 'https://cdn.jsdelivr.net/gh/daknux/covers@main/72.png',
    resolution: 100
  },
  {
    id: 'app-te',
    name: 'TossIt',
    url: './te/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './te/index.png',
    resolution: 100
  },
  {
    id: 'app-bfdia5b',
    name: 'BFDIA 5b',
    url: './bfdia5b/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './bfdia5b/index.webp',
    resolution: 100
  },
  {
    id: 'app-bfdia5b530',
    name: 'BFDIA 5b: 5*30',
    url: './bfdia5b530/index.html',
    icon: 'gear',
    cat: 'Games',
    iconUrl: './bfdia5b/index.webp',
    resolution: 100
  },
  {
    id: 'app-oscocc',
    name: 'OSC OC Creator',
    url: './oscocc/index.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './oscocc/index.png',
    resolution: 100
  },
  {
    id: 'app-pvzhstm',
    name: 'Plants vs Zombies Hybrid Story Mod',
    url: './dm/index.html#/class/plants-vs-zombie-hybrid-story-mod',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: '',
    resolution: 100
  },
  {
    id: 'app-linux',
    name: 'Linux (TinyCore)',
    url: './linux/index.html',
    icon: 'gamepad',
    cat: 'Tools',
    iconUrl: './linux/index.jpg',
    resolution: 100
  },
  {
    id: 'app-tok',
    name: 'WatchTok',
    url: './watchtok/index.html',
    icon: 'gamepad',
    cat: 'Entertainment',
    iconUrl: './watchtok/index.png',
    resolution: 100
  },
  {
    id: 'app-fnaf1',
    name: 'FNAF',
    url: './fnaf/1.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './fnaf/1.webp',
    resolution: 100
  },
  {
    id: 'app-fnaf2',
    name: 'FNAF 2',
    url: './fnaf/2.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './fnaf/2.webp',
    resolution: 100
  },
  {
    id: 'app-fnaf3',
    name: 'FNAF 3',
    url: './fnaf/index.html#3.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './fnaf/3.webp',
    resolution: 100
  },
  {
    id: 'app-fnaf4',
    name: 'FNAF 4',
    url: './fnaf/index.html#4.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './fnaf/4.webp',
    resolution: 100
  },
  {
    id: 'app-rblx',
    name: 'RОblox',
    url: './roblox/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './roblox/index.png',
    resolution: 100
  },
  {
    id: 'app-l2f2',
    name: 'Learn 2 Fly 2',
    url: './dm#/class/learn-2-fly-2',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: 'https://duckmath.com/lessons/learntofly2.webp',
    resolution: 100
  },
  {
    id: 'app-popplay',
    name: 'Poppy Playtime',
    url: './popplay/index.html',
    icon: 'gamepad',
    cat: 'Games',
    iconUrl: './popplay/index.png',
    resolution: 100
  },
  {
    id: 'app-wc',
    name: 'WebChat',
    url: './chat/index.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './chat/index.png',
    resolution: 100
  },
  {
    id: 'app-cam',
    name: 'Camera',
    url: './cam/index.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './cam/index.png',
    resolution: 100
  },
  {
    id: 'app-rb',
    name: 'Retro Bowl',
    url: './rb/index.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './rb/index.webp',
    resolution: 100
  },
  {
    id: 'app-rbc',
    name: 'Retro Bowl College',
    url: './rb/college.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './rb/college.webp',
    resolution: 100
  },
  {
    id: 'app-60sa',
    name: '60 Seconds Reatomized',
    url: './60sa/index.html',
    icon: 'gear',
    cat: 'Tools',
    iconUrl: './60sa/index.webp',
    resolution: 100
  },
];
const DEFAULT_TILES = [
  {id:'tl0',appId:'app-suggest', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl1',appId:'app-desk', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl2',appId:'app-set', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl3',appId:'app-mc262', size:'smll',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl4',appId:'app-calc', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl5',appId:'app-yt', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl6',appId:'app-ppt', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl7',appId:'app-ai', size:'small',   group:'Apps',        color:'#2d7d9a'},
  {id:'tl8',appId:'app-term', size:'small',   group:'Apps',        color:'#0c0c0c'},
  {id:'tl9',appId:'app-crash', size:'small',   group:'Apps',        color:'#e74856'},
  {id:'tl10',appId:'app-xwp', size:'small',   group:'Apps',        color:'#8e44ad'},
  {id:'tl11',appId:'app-plug', size:'small',   group:'Apps',        color:'#744da9'},

];
const DEFAULT_DICONS = [
  {id:'di1',appId:'app-ie'},
  {id:'di2',appId:'app-isweartogodifyoufindthenotebookhotiwilldisinegrateyou'},
  {id:'di3',appId:'app-set'},
  {id:'di4',appId:'app-term'},
  {id:'di5',appId:'app-xwp'},
];
const DEFAULT_GROUPS = ['Apps'];