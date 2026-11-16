/* ---------- MY PHONE APPS ---------- */
var PRESETS=[["YouTube","https://www.youtube.com","#E0261B"],["TikTok","https://www.tiktok.com","#121212"],["Instagram","https://www.instagram.com","#B4307A"],["Snapchat","snapchat://","#F2D500"],["WhatsApp","whatsapp://","#1FA855"],["Spotify","https://open.spotify.com","#169C46"],["Netflix","https://www.netflix.com","#A30A12"],["Discord","https://discord.com/app","#5865F2"],["Twitch","https://www.twitch.tv","#7B3FE4"],["X","https://x.com","#121212"],["Telegram","tg://","#2A9FD8"],["Plans","maps://","#3A9A4B"]];
var COLORS=["#007AFF","#FF9500","#34C759","#AF52DE","#FF2D55","#5AC8FA","#FFCC00"];
var editMode=false,stab="today";
try{stab=localStorage.getItem("lima.tab")||"today"}catch(e){}
function myApps(){var a=store.get("lima.myapps");return Array.isArray(a)?a:[]}
function setMyApps(a){store.set("lima.myapps",a)}
function letterIcon(a){var dark=/F2D500|FFCC00/i.test(a.c);return '<span class="letter" style="background:linear-gradient(160deg,'+a.c+','+a.c+'CC);color:'+(dark?"#111":"#fff")+'">'+esc(a.n.trim().charAt(0).toUpperCase()||"?")+'</span>'}
function normLink(u){u=u.trim();if(!u)return "";if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u="https://"+u;return u}
function myTile(a,k){
 var isWeb=/^https?:/i.test(a.u);
 if(editMode)return '<div class="app wig"><button class="x" data-rm="'+k+'" aria-label="Retirer '+esc(a.n)+'">−</button><span class="ic">'+letterIcon(a)+'</span><b>'+esc(a.n)+'</b></div>';
 return '<a class="app" href="'+esc(a.u)+'"'+(isWeb?' target="_blank" rel="noopener"':"")+'><span class="ic">'+letterIcon(a)+'</span><b>'+esc(a.n)+'</b></a>';
}
var XSVG='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
function openAdd(){
 var mine=myApps().map(function(a){return a.n});
 $("#overlay").innerHTML='<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Ajouter une app"><div class="grab"></div><button class="closex" data-close="1" aria-label="Fermer">'+XSVG+'</button><h5 style="font-family:var(--f-sysd);font-size:28px;font-weight:700;margin:6px 0 0;letter-spacing:-.02em">Ajouter une app</h5><p style="color:var(--label2);margin-top:4px">Touche une app pour l\'ajouter à Lima.</p><div class="presets">'
  +PRESETS.filter(function(p){return mine.indexOf(p[0])<0}).map(function(p){return '<button class="app" data-preset="'+p[0]+'"><span class="ic">'+letterIcon({n:p[0],c:p[2]})+'</span><b>'+p[0]+'</b></button>'}).join("")
  +'</div><label class="lbl2" for="addName">Une autre app</label><input class="field" id="addName" placeholder="Nom (ex. Deezer)" autocomplete="off"><input class="field" id="addUrl" placeholder="Lien (ex. deezer.com)" autocomplete="off" inputmode="url" autocapitalize="none"><button class="btn-s" data-addcustom="1">Ajouter</button><div class="note">L\'app s\'ouvre si elle est installée sur ton iPhone, sinon c\'est son site qui s\'ouvre.</div></div>';
}

/* ---------- STORE ---------- */
var TABS=[["today","Aujourd'hui",'<svg viewBox="0 0 28 28" fill="currentColor"><rect x="4" y="4" width="20" height="13" rx="3.5"/><rect x="4" y="19.5" width="20" height="4.5" rx="2.25" opacity=".55"/></svg>'],["apps","Apps",'<svg viewBox="0 0 28 28" fill="currentColor"><rect x="4" y="4" width="9" height="9" rx="2.6"/><rect x="15" y="4" width="9" height="9" rx="2.6"/><rect x="4" y="15" width="9" height="9" rx="2.6"/><rect x="15" y="15" width="9" height="9" rx="2.6" opacity=".55"/></svg>'],["games","Jeux",'<svg viewBox="0 0 28 28" fill="currentColor"><path d="M9 8h10a6 6 0 0 1 5.7 7.9l-1.2 3.7a2.8 2.8 0 0 1-4.6 1.1L16.6 18h-5.2l-2.3 2.7a2.8 2.8 0 0 1-4.6-1.1l-1.2-3.7A6 6 0 0 1 9 8Zm0 3.2v1.6H7.4v1.6H9V16h1.6v-1.6h1.6v-1.6h-1.6v-1.6Zm9.6 1.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm2.4-2.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z"/></svg>']];
var GAME_APPS=["qg","nocta","volta","frequence","champion"];
function A_(id){return APPS.filter(function(a){return a.id===id})[0]}
function arow(a){return '<button class="arow press" data-app="'+a.id+'"><span class="ic">'+ICON[a.id]+'</span><span class="t"><b>'+a.name+'</b><small>'+a.tag+'</small></span><span class="pill">OUVRIR</span></button>'}
function grow(id){var s=store.get("lima2."+id),g=GAMES[id];return '<button class="arow press" data-game="'+id+'"><span class="ic">'+ICON[id]+'</span><span class="t"><b>'+g.full+'</b><small>'+(s&&s.last?g.summary(s):g.tag)+'</small></span><span class="pill">JOUER</span></button>'}
function largeTitle(t,showDate){var d=new Date();return '<div class="lt"><div>'+(showDate?'<div class="date">'+d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+'</div>':"")+'<h1>'+t+'</h1></div><button class="avatar" data-stab="apps" aria-label="Lima">'+limaLogo("#121316")+'</button></div>'}
function lastGame(){var best=null;GIDS.forEach(function(id){var s=store.get("lima2."+id);if(s&&s.last&&(!best||s.last>best.s.last))best={id:id,s:s}});return best}
function viewToday(){
 var best=lastGame(),fid=best?best.id:"mafia",g=GAMES[fid];
 var h=largeTitle("Aujourd'hui",true)+'<div class="today">';
 h+='<button class="tcard tall press" data-game="'+fid+'"><canvas data-art="'+fid+'"></canvas><div class="cap"><div class="k">'+(best?"Reprends ta partie":"Nouveau dans Lima")+'</div><h3>'+(best?{bastion:"Tes soldats t'attendent",mafia:"La ville n'attend que toi",studio:"Vise la première place"}[fid]:"Prends la ville quartier par quartier")+'</h3></div><div class="foot"><span class="ic">'+ICON[fid]+'</span><div><b>'+g.full+'</b><small>'+(best?g.summary(best.s):g.tag)+'</small></div><span class="pill">JOUER</span></div></button>';
 var pads=["#FF5D5D","#FF5D5D","#9B6BFF","#3FA7FF","#9B6BFF","#2FD69A","#3FA7FF","#2FD69A","#FFB23F","#2FD69A","#FF5D5D","#FFB23F","#3FA7FF","#FFB23F","#9B6BFF","#FF5D5D"];
 h+='<button class="tcard tall press" data-app="volta"><div class="art padart">'+pads.map(function(c,i){return '<i style="background:'+c+';color:'+c+';--d:'+((i*0.37)%1.9).toFixed(2)+'s"></i>'}).join("")+'</div><div class="cap" style="position:absolute;top:0;left:0;right:0"><div class="k">À essayer</div><h3>Deviens DJ en trois pads</h3></div><div class="foot"><span class="ic">'+ICON.volta+'</span><div><b>Volta</b><small>Lance des boucles comme un DJ</small></div><span class="pill">OUVRIR</span></div></button>';
 h+='<div class="tcard list"><div class="k">Tes créations</div><h3>Ce que tu as construit</h3>'+["ascendant","azimut","velours","ciel"].map(function(id){return arow(A_(id))}).join("")+'</div>';
 h+='<button class="tcard tall press" data-game="'+(fid==="studio"?"bastion":"studio")+'"><canvas data-art="'+(fid==="studio"?"bastion":"studio")+'"></canvas><div class="cap"><div class="k">Dossier Tycoon</div><h3>'+(fid==="studio"?"Construis ta base, envoie tes troupes":"Lance ton studio d'applis")+'</h3></div><div class="foot"><span class="ic">'+ICON[fid==="studio"?"bastion":"studio"]+'</span><div><b>'+GAMES[fid==="studio"?"bastion":"studio"].full+'</b><small>'+GAMES[fid==="studio"?"bastion":"studio"].tag+'</small></div><span class="pill">JOUER</span></div></button>';
 return h+'</div>';
}
function viewApps(){
 var mine=myApps();
 var h=largeTitle("Apps");
 h+='<div class="hdr" style="border-top:0;margin-top:14px"><div><h2>Mes créations</h2><small>Faites par Seven</small></div></div><div class="hs">'+APPS.map(arow).join("")+'</div>';
 h+='<div class="hdr"><div><h2>Accès rapide</h2></div></div><div class="grid">'+APPS.map(function(a){return '<button class="app" data-app="'+a.id+'"><span class="ic">'+ICON[a.id]+'</span><b>'+a.name+'</b></button>'}).join("")+'<button class="app folder" data-folder="1"><span class="ic"><i>'+ICON.bastion+'</i><i>'+ICON.mafia+'</i><i>'+ICON.studio+'</i></span><b>Tycoon</b></button></div>';
 h+='<div class="hdr"><div><h2>Mon iPhone</h2><small>Tes autres apps</small></div>'+(mine.length?'<button class="link" data-edit="1">'+(editMode?"OK":"Modifier")+'</button>':"")+'</div><div class="grid">'+mine.map(myTile).join("")+(editMode?"":'<button class="app" data-add="1"><span class="ic addic">+</span><b>Ajouter</b></button>')+'</div>';
 return h+'<div class="foottxt">Lima Store · '+(APPS.length+3)+' créations</div>';
}
function viewGames(){
 var h=largeTitle("Jeux");
 h+='<div class="hdr" style="border-top:0;margin-top:14px"><div><h2>Dossier Tycoon</h2><small>Ça tourne même quand l\'appli est fermée</small></div></div><div class="hs big">'+GIDS.map(function(id){var s=store.get("lima2."+id),g=GAMES[id];return '<button class="gcard press" data-game="'+id+'"><canvas data-art="'+id+'"></canvas><div class="cap"><div class="k">Tycoon</div><h3>'+g.full+'</h3><p>'+g.tag+'</p></div><div class="foot"><span class="ic">'+ICON[id]+'</span><div>'+(s&&s.last?g.summary(s):"Nouvelle partie")+'</div><span class="pill">JOUER</span></div></button>'}).join("")+'</div>';
 h+='<div class="hdr"><div><h2>Tous les jeux</h2></div></div><div class="groupcard">'+GAME_APPS.map(function(id){return arow(A_(id))}).join("")+GIDS.map(grow).join("")+'</div>';
 return h;
}
function renderStore(){
 var el=$("#store");
 var v=stab==="apps"?viewApps():stab==="games"?viewGames():viewToday();
 el.innerHTML='<div class="view">'+v+'</div>';
 var nav=$("#navT");if(!nav){document.body.insertAdjacentHTML("beforeend",'<div class="nav" id="navT"></div><nav class="tabbar" id="tabbar"></nav>');nav=$("#navT")}
 nav.textContent=TABS.filter(function(t){return t[0]===stab})[0][1];
 $("#tabbar").innerHTML=TABS.map(function(t){return '<button data-stab="'+t[0]+'" class="'+(t[0]===stab?"on":"")+'">'+t[2]+'<span>'+t[1]+'</span></button>'}).join("");
 document.querySelectorAll("canvas[data-art]").forEach(function(c){drawArt(c,c.dataset.art)});
 onScroll();
}
function onScroll(){var n=$("#navT");if(n)n.classList.toggle("show",window.scrollY>44&&!cur)}
window.addEventListener("scroll",onScroll,{passive:true});
function drawArt(cv,id){
 var r=cv.getBoundingClientRect();if(!r.width)return;var dp=Math.min(2,devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
 var c=cv.getContext("2d");c.scale(dp,dp);var w=r.width,h=r.height;
 var pal={bastion:["#2E3520","#12150D","#D2B04C"],mafia:["#4A231C","#120A09","#C9A15B"],studio:["#1F2A66","#080A16","#6E8BFF"]}[id];
 var gr=c.createLinearGradient(0,0,w*.4,h);gr.addColorStop(0,pal[0]);gr.addColorStop(1,pal[1]);c.fillStyle=gr;c.fillRect(0,0,w,h);
 c.strokeStyle=pal[2];c.lineWidth=1;
 if(id==="bastion"){for(var k=0;k<16;k++){c.globalAlpha=.1+.25*(k/16);c.beginPath();for(var x=0;x<=w;x+=6){var y=h*.25+k*h/26+Math.sin(x/50+k*.7)*14+Math.sin(x/19+k)*4;x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
 else if(id==="mafia"){for(var a=0;a<46;a++){c.globalAlpha=.06+(a%3===0?.18:.06);c.beginPath();c.moveTo(w*.5,h*1.05);c.lineTo(w*.5+Math.cos(Math.PI+a*.07)*h*1.5,h*1.05+Math.sin(Math.PI+a*.07)*h*1.5);c.stroke()}c.globalAlpha=.9;c.fillStyle=pal[2];c.beginPath();c.arc(w*.5,h*1.05,h*.28,Math.PI,0);c.globalAlpha=.12;c.fill()}
 else{var s=16;for(var i=0;i<w;i+=s)for(var j=0;j<h;j+=s){var d=Math.hypot(i-w*.75,j-h*.3)/Math.max(w,h);var p=Math.max(0,.7-d)*1.1;if(Math.random()<p){c.globalAlpha=Math.random()*.6*p+.05;c.fillStyle=pal[2];c.beginPath();c.roundRect?c.roundRect(i+2,j+2,s-4,s-4,3):c.rect(i+2,j+2,s-4,s-4);c.fill()}}}
 c.globalAlpha=1;
 var img=new Image();img.onload=function(){var z=Math.min(w,h)*.42;c.globalAlpha=.95;c.drawImage(img,w-z-18,h*.4,z,z);var sh=c.createLinearGradient(0,h*.45,0,h);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(0,0,0,.55)");c.globalAlpha=1;c.fillStyle=sh;c.fillRect(0,0,w,h)};
 img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(ICON[id].replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" ').replace(/<rect width="100" height="100" fill="[^"]+"\/>/,""));
}
function drawFeat(){document.querySelectorAll("canvas[data-art]").forEach(function(c){drawArt(c,c.dataset.art)})}
document.addEventListener("click",function(e){var t=e.target.closest("[data-stab]");if(!t)return;var n=t.dataset.stab;if(n===stab){window.scrollTo({top:0,behavior:"smooth"});return}stab=n;try{localStorage.setItem("lima.tab",n)}catch(err){}editMode=false;window.scrollTo(0,0);renderStore()});

/* ---------- OVERLAYS ---------- */
function closeOverlay(){$("#overlay").innerHTML=""}
function openFolder(){
 $("#overlay").innerHTML='<div class="scrim blur" data-close="1"><div class="fold"><h4>Tycoon</h4><div class="box">'+GIDS.map(function(id){return '<button class="app" data-game="'+id+'"><span class="ic">'+ICON[id]+'</span><b>'+GAMES[id].name+'</b></button>'}).join("")+'</div></div></div>';
}
function openApp(id){
 var a=A_(id);
 $("#overlay").innerHTML='<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="'+a.name+'"><div class="grab"></div><button class="closex" data-close="1" aria-label="Fermer">'+XSVG+'</button><div class="sh-head"><span class="ic">'+ICON[a.id]+'</span><div><h5>'+a.name+'</h5><small>'+a.tag+'</small><a class="open" href="'+a.url+'" target="_blank" rel="noopener">OUVRIR</a></div></div><div class="facts"><div><em>Catégorie</em><strong>'+a.cat.split(" · ")[0]+'</strong></div><div><em>Créateur</em><strong>Seven</strong></div><div><em>Statut</em><strong>'+(a.live?"En ligne":"Inclus")+'</strong></div></div><h6>Description</h6><p>'+a.desc+'</p><div class="note">'+(a.live?"Astuce : dans Safari, Partager → Sur l'écran d'accueil pour l'avoir comme une vraie appli.":"Incluse dans Lima Store, elle s'ouvre directement.")+'</div></div>';
}
