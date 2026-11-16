/* ---------- MY PHONE APPS ---------- */
var PRESETS=[["YouTube","https://www.youtube.com","#E0261B"],["TikTok","https://www.tiktok.com","#121212"],["Instagram","https://www.instagram.com","#B4307A"],["Snapchat","snapchat://","#F2D500"],["WhatsApp","whatsapp://","#1FA855"],["Spotify","https://open.spotify.com","#169C46"],["Netflix","https://www.netflix.com","#A30A12"],["Discord","https://discord.com/app","#5865F2"],["Twitch","https://www.twitch.tv","#7B3FE4"],["X","https://x.com","#121212"],["Telegram","tg://","#2A9FD8"],["Plans","maps://","#3A9A4B"]];
var editMode=false;
function myApps(){var a=store.get("lima.myapps");return Array.isArray(a)?a:[]}
function setMyApps(a){store.set("lima.myapps",a)}
function letterIcon(a){var dark=/F2D500/i.test(a.c);return '<span class="letter" style="background:'+a.c+';color:'+(dark?"#111":"#fff")+'">'+esc(a.n.trim().charAt(0).toUpperCase()||"?")+'</span>'}
function normLink(u){u=u.trim();if(!u)return "";if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u="https://"+u;return u}
function myTile(a,k){
 var isWeb=/^https?:/i.test(a.u);
 if(editMode)return '<div class="app wig" style="position:relative"><button class="x" data-rm="'+k+'" aria-label="Retirer '+esc(a.n)+'">×</button><span class="ic">'+letterIcon(a)+'</span><b>'+esc(a.n)+'</b></div>';
 return '<a class="app" href="'+esc(a.u)+'"'+(isWeb?' target="_blank" rel="noopener"':"")+'><span class="ic">'+letterIcon(a)+'</span><b>'+esc(a.n)+'</b></a>';
}
function openAdd(){
 var mine=myApps().map(function(a){return a.n});
 $("#overlay").innerHTML='<div class="scrim" data-close="1" style="align-items:flex-end;padding:0"></div><div class="sheet" role="dialog" aria-label="Ajouter une app"><div class="grab"></div><h5 style="font-family:var(--f-disp);font-size:24px;margin:0;letter-spacing:-.02em">Ajouter une app</h5><p style="margin-top:6px;color:var(--mute)">Touche une app de ton téléphone pour l\'ajouter à Lima Store.</p><div class="presets">'
  +PRESETS.filter(function(p){return mine.indexOf(p[0])<0}).map(function(p){return '<button class="app" data-preset="'+p[0]+'"><span class="ic">'+letterIcon({n:p[0],c:p[2]})+'</span><b>'+p[0]+'</b></button>'}).join("")
  +'</div><label class="lbl2" for="addName">Une autre app</label><input class="field" id="addName" placeholder="Nom, par ex. Deezer" autocomplete="off"><input class="field" id="addUrl" placeholder="Lien, par ex. deezer.com" autocomplete="off" inputmode="url" autocapitalize="none"><button class="btn-s" data-addcustom="1">Ajouter</button><div class="note">L\'app s\'ouvre si elle est installée sur ton téléphone, sinon le site s\'ouvre. Ça marche mieux depuis Lima Store sur ton écran d\'accueil.</div></div>';
}
var COLORS=["#2B44E8","#D2603A","#2E8B6E","#8A4FD0","#C7365A","#1F7FA8","#B88A1E"];

/* ---------- STORE RENDER ---------- */
function renderStore(){
 var el=$("#store"),d=new Date();
 var hello=d.getHours()<6?"Bonne nuit":d.getHours()<18?"Bonjour":"Bonsoir";
 var best=null;
 GIDS.forEach(function(id){var s=store.get("lima2."+id);if(s&&s.last&&(!best||s.last>best.s.last))best={id:id,s:s}});
 var fid=best?best.id:"bastion",feat=GAMES[fid];
 var featHTML='<button class="feat" data-game="'+fid+'"><canvas id="featCv"></canvas><span class="k">'+(best?"Reprendre":"Nouveau · Dossier Tycoon")+'</span><h2>'+feat.full+'</h2><p>'+(best?feat.summary(best.s):"Trois tycoons, trois façons de jouer. Ça continue de tourner quand tu fermes l'appli.")+'</p></button>';
 var mine=myApps();
 var grid=APPS.map(function(a){return '<button class="app" data-app="'+a.id+'"><span class="ic">'+ICON[a.id]+'</span><b>'+a.name+'</b></button>'}).join("");
 grid+='<button class="app folder" data-folder="1"><span class="ic"><i>'+ICON.bastion+'</i><i>'+ICON.mafia+'</i><i>'+ICON.studio+'</i></span><b>Tycoon</b></button>';
 var mineGrid=mine.map(myTile).join("")+(editMode?"":'<button class="app" data-add="1"><span class="ic addic">+</span><b>Ajouter</b></button>');
 var list=APPS.map(function(a){return '<button class="row" data-app="'+a.id+'"><span class="ic">'+ICON[a.id]+'</span><span class="t"><b>'+a.name+'</b><small>'+a.tag+'</small></span><span class="get">Ouvrir</span></button>'}).join("");
 el.innerHTML='<div class="top"><div><div class="eyebrow">'+hello+' Seven · '+d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+'</div><div class="word">Lima <i>Store</i></div></div><div class="mono-badge" aria-hidden="true">'+limaLogo()+'</div></div><div class="rule"></div>'
  +featHTML
  +'<div class="sec"><h3>Mes créations</h3><span>'+(APPS.length+3)+' apps · 1 dossier</span></div><div class="grid">'+grid+'</div>'
  +'<div class="sec"><h3>Mon téléphone</h3>'+(mine.length?'<button class="edit-link" data-edit="1">'+(editMode?"Terminé":"Modifier")+'</button>':'<span>tes autres apps</span>')+'</div><div class="grid">'+mineGrid+'</div>'
  +'<div class="sec"><h3>Dossier Tycoon</h3><span>hors ligne</span></div><div class="list">'+GIDS.map(function(id){var s=store.get("lima2."+id);return '<button class="row" data-game="'+id+'"><span class="ic">'+ICON[id]+'</span><span class="t"><b>'+GAMES[id].full+'</b><small>'+(s&&s.last?GAMES[id].summary(s):GAMES[id].tag)+'</small></span><span class="get">Jouer</span></button>'}).join("")+'</div>'
  +'<div class="sec"><h3>Toutes mes créations</h3><span>'+APPS.length+'</span></div><div class="list">'+list+'</div>'
  +'<div class="foot">Lima Store regroupe les applis créées par Seven et tes apps préférées. Les tycoons sauvegardent ta partie sur ce téléphone et continuent de tourner pendant ton absence (jusqu\'à 8 h).</div>';
 drawFeat(fid);
}
function drawFeat(id){
 var cv=$("#featCv");if(!cv)return;var r=cv.getBoundingClientRect(),dp=Math.min(2,devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
 var c=cv.getContext("2d");c.scale(dp,dp);var w=r.width,h=r.height;
 var pal={bastion:["#1B1F15","#2A2F1F","#D2B04C"],mafia:["#1C1412","#3A2320","#C9A15B"],studio:["#0E1120","#1B2140","#6E8BFF"]}[id];
 var gr=c.createLinearGradient(0,0,w,h);gr.addColorStop(0,pal[1]);gr.addColorStop(1,pal[0]);c.fillStyle=gr;c.fillRect(0,0,w,h);
 c.strokeStyle=pal[2];c.globalAlpha=.35;c.lineWidth=1;
 if(id==="bastion"){for(var k=0;k<9;k++){c.beginPath();for(var x=0;x<=w;x+=8){var y=30+k*16+Math.sin(x/40+k)*8+Math.sin(x/17+k*2)*3;x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
 else if(id==="mafia"){for(var a=0;a<28;a++){c.beginPath();c.moveTo(w*.8,h*1.1);c.lineTo(w*.8+Math.cos(Math.PI+a*.115)*w,h*1.1+Math.sin(Math.PI+a*.115)*w);c.stroke()}}
 else{for(var i=0;i<w;i+=14)for(var j=0;j<h;j+=14){if(Math.random()<.18){c.globalAlpha=Math.random()*.5;c.fillStyle=pal[2];c.fillRect(i,j,10,10)}}}
 c.globalAlpha=1;var sh=c.createLinearGradient(0,h*.3,0,h);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(0,0,0,.65)");c.fillStyle=sh;c.fillRect(0,0,w,h);
 var img=new Image();img.onload=function(){c.drawImage(img,w-92,10,80,80)};img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(ICON[id].replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" ').replace(/<rect width="100" height="100" fill="[^"]+"\/>/,""));
}

/* ---------- OVERLAYS ---------- */
function closeOverlay(){$("#overlay").innerHTML=""}
function openFolder(){
 $("#overlay").innerHTML='<div class="scrim" data-close="1"><div class="fold"><h4>Tycoon</h4><div class="box">'+GIDS.map(function(id){return '<button class="app" data-game="'+id+'"><span class="ic">'+ICON[id]+'</span><b>'+GAMES[id].name+'</b></button>'}).join("")+'</div></div></div>';
}
function openApp(id){
 var a=APPS.filter(function(x){return x.id===id})[0];
 $("#overlay").innerHTML='<div class="scrim" data-close="1" style="align-items:flex-end;padding:0"></div><div class="sheet" role="dialog" aria-label="'+a.name+'"><div class="grab"></div><div class="sh-head"><span class="ic">'+ICON[a.id]+'</span><div><h5>'+a.name+'</h5><small>'+a.tag+'</small><br><a class="open" href="'+a.url+'" target="_blank" rel="noopener">Ouvrir</a></div></div><div class="facts"><div><em>Genre</em><strong>'+a.cat.split(" · ")[0]+'</strong></div><div><em>Créé par</em><strong>Seven</strong></div><div><em>Statut</em><strong>'+(a.live?"En ligne":"Aperçu")+'</strong></div></div><p>'+a.desc+'</p><div class="note">'+(a.live?"Astuce : dans Safari, Partager → Sur l'écran d'accueil pour l'avoir comme une vraie appli.":"Elle s'ouvre directement dans le navigateur.")+'</div></div>';
}

/* ---------- GAME SHELL ---------- */
var cur=null,GM=null,S=null,tab=null,tick=null,lastT=0,lastSig="",lastSave=0,sheetFn=null;
function openGame(id,skipHash){
 closeOverlay();cur=id;GM=GAMES[id];S=gload(id);tab=GM.tabs[0][0];sheetFn=null;
 var gm=$("#game");gm.className=GM.cls;gm.hidden=false;document.body.style.overflow="hidden";
 gm.innerHTML='<div class="wrap"><div class="g-top"><button class="g-back" data-back="1" aria-label="Retour au store"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></button><div class="g-title"><small>Lima Store · Tycoon</small><b>'+GM.full+'</b></div></div>'
  +'<div class="g-hud"><div class="chips" id="gTop"></div><div class="g-rank"><span>Rang : <b id="gRank"></b></span><span id="gNext"></span></div><div class="bar"><i id="gBar"></i></div></div>'
  +'<div class="tabs" id="gTabs"></div><div id="gBody"></div></div><div id="gSheet"></div>';
 // offline
 var wasNew=S.isNew;delete S.isNew;
 var away=Math.min(8*3600,(Date.now()-(S.last||Date.now()))/1000);
 if(!wasNew&&away>20){var c0=S.cash,steps=Math.ceil(away/5),dt=away/steps;for(var k=0;k<steps;k++)GM.step(S,dt);var gain=S.cash-c0;var af=GM.after&&GM.after(S);
  showModal(["Pendant ton absence ("+fmtTime(away)+")",(gain>=0?"+":"")+fmt(gain)+" "+GM.unit,id==="bastion"?"Ta base a tourné sans toi. Pense à récupérer tes missions.":id==="mafia"?"Tes affaires ont tourné."+(af?" Attention : il y a eu une descente de police.":""):"Tes applis ont continué d'être téléchargées."]);}
 else if(wasNew){showModal(["Nouvelle partie",GM.full,{bastion:"Construis ta base case par case, puis envoie tes soldats en mission. Pas besoin de cliquer en boucle : tout tourne tout seul.",mafia:"Tu tiens un seul quartier. Ouvre des affaires, recrute des hommes, prends les quartiers voisins et surveille la police.",studio:"Lance une petite appli, embauche une équipe et grimpe le classement du Store jusqu'à la première place."}[id]],"C'est parti")}
 if(!skipHash)try{history.pushState({g:id},"","#"+id)}catch(e){location.hash=id}
 gsave(id,S);renderTabs();renderBody(true);
 lastT=performance.now();clearInterval(tick);tick=setInterval(loop,500);
}
function closeGame(){if(!cur)return;gsave(cur,S);clearInterval(tick);cur=null;$("#game").hidden=true;$("#game").innerHTML="";document.body.style.overflow="";renderStore()}
function loop(){
 var now=performance.now(),dt=Math.min(2,(now-lastT)/1000);lastT=now;
 GM.step(S,dt);var af=GM.after&&GM.after(S);if(af)handle(af);
 renderTop();
 var sg=GM.sig(S,tab);if(sg!==lastSig)renderBody();
 live();
 if(Date.now()-lastSave>4000){gsave(cur,S);lastSave=Date.now()}
}
function renderTop(){
 $("#gTop").innerHTML=GM.top(S);var r=GM.rank(S);$("#gRank").textContent=r.name;$("#gNext").textContent=r.next?"→ "+r.next:"Sommet atteint";$("#gBar").style.width=(r.p*100).toFixed(1)+"%";
 var bs=document.querySelectorAll("#gTabs [data-tab]");bs.forEach(function(b){var n=GM.badge(S,b.dataset.tab);var i=b.querySelector("i");if(n&&!i){i=document.createElement("i");b.appendChild(i)}if(i){if(n)i.textContent=n;else i.remove()}});
}
function renderTabs(){$("#gTabs").innerHTML=GM.tabs.map(function(t){return '<button data-tab="'+t[0]+'" class="'+(t[0]===tab?"on":"")+'">'+t[1]+'</button>'}).join("");renderTop()}
function renderBody(){lastSig=GM.sig(S,tab);$("#gBody").innerHTML=GM.body(S,tab);live()}
function live(){
 var now=Date.now();
 document.querySelectorAll("#game [data-cd]").forEach(function(e){e.textContent=fmtTime((+e.dataset.cd-now)/1000)});
 document.querySelectorAll("#game [data-pg]").forEach(function(e){var p=e.dataset.pg.split("|");e.style.width=clamp((now-p[0])/(p[1]-p[0]),0,1)*100+"%"});
 if(GM.live)GM.live(S);
}
function showModal(m,btn){var d=document.createElement("div");d.className="modal";d.innerHTML='<div class="card2"><small>'+m[0]+'</small><b>'+m[1]+'</b><div>'+m[2]+'</div><button data-x="1">'+(btn||"Ok")+'</button></div>';$("#game").appendChild(d)}
function openGSheet(html){$("#gSheet").innerHTML='<div class="gsheet-scrim" data-gclose="1"></div><div class="gsheet" role="dialog"><div style="display:flex;justify-content:flex-end"><button class="btn ghost" data-gclose="1" style="padding:6px 10px">Fermer</button></div>'+html+'</div>'}
function closeGSheet(){$("#gSheet").innerHTML="";sheetFn=null}
function handle(r){
 if(!r)return;
 if(r.close)closeGSheet();
 if(r.sheet){openGSheet(r.sheet)}
 if(r.reopen){var x=GM.act(S,r.reopen[0],r.reopen[1]);if(x&&x.sheet)openGSheet(x.sheet)}
 if(r.toast)toast(r.toast);
 if(r.modal){closeGSheet();showModal(r.modal)}
 gsave(cur,S);lastSave=Date.now();renderTop();renderBody();
}
function toast(t){var o=document.querySelector(".toast");if(o)o.remove();var d=document.createElement("div");d.className="toast";d.textContent=t;$("#game").appendChild(d);setTimeout(function(){d.remove()},2200)}

/* ---------- EVENTS ---------- */
document.addEventListener("click",function(e){
 var t=e.target.closest("button,[data-close],[data-gclose]");if(!t)return;
 if(t.dataset.close!==undefined&&t.dataset.close&&e.target===t){closeOverlay();return}
 if(t.dataset.gclose){closeGSheet();return}
 if(t.dataset.folder){openFolder();return}
 if(t.dataset.add){openAdd();return}
 if(t.dataset.edit){editMode=!editMode;renderStore();return}
 if(t.dataset.rm!==undefined){var l=myApps();l.splice(+t.dataset.rm,1);setMyApps(l);if(!l.length)editMode=false;renderStore();return}
 if(t.dataset.preset){var p=PRESETS.filter(function(x){return x[0]===t.dataset.preset})[0];var l2=myApps();l2.push({n:p[0],u:p[1],c:p[2]});setMyApps(l2);closeOverlay();renderStore();return}
 if(t.dataset.addcustom){var n=$("#addName").value.trim(),u=normLink($("#addUrl").value);if(!n||!u){$("#addName").focus();return}var l3=myApps();l3.push({n:n.slice(0,20),u:u,c:COLORS[l3.length%COLORS.length]});setMyApps(l3);closeOverlay();renderStore();return}
 if(t.dataset.app){openApp(t.dataset.app);return}
 if(t.dataset.game){openGame(t.dataset.game);return}
 if(t.dataset.back){if(location.hash){history.back()}else closeGame();return}
 if(!cur)return;
 if(t.dataset.x){t.closest(".modal").remove();return}
 if(t.dataset.tab){tab=t.dataset.tab;closeGSheet();renderTabs();renderBody();$("#game").scrollTop=Math.min($("#game").scrollTop,140);return}
 if(t.dataset.a){if(t.disabled)return;handle(GM.act(S,t.dataset.a,t.dataset.v));return}
});
window.addEventListener("popstate",function(){var h=location.hash.slice(1);if(GAMES[h]&&!cur)openGame(h,true);else if(!GAMES[h]&&cur)closeGame()});
window.addEventListener("hashchange",function(){var h=location.hash.slice(1);if(GAMES[h]&&cur!==h){if(cur)closeGame();openGame(h,true)}else if(!GAMES[h]&&cur)closeGame()});
document.addEventListener("visibilitychange",function(){if(!cur)return;if(document.hidden)gsave(cur,S);else{var away=(Date.now()-S.last)/1000;if(away>2){var steps=Math.ceil(away/5);for(var k=0;k<steps;k++)GM.step(S,away/steps);lastT=performance.now()}}});
window.addEventListener("pagehide",function(){if(cur)gsave(cur,S)});
window.addEventListener("resize",function(){if(!cur){var b=$(".feat");drawFeat(b?b.dataset.game:"bastion")}});

/* ---------- LOGO + INTRO ---------- */
function limaLogo(bg){var c=[[0,0,"#7D8CFF"],[0,1],[0,2],[1,2],[2,2]];return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+(bg?'<rect width="100" height="100" fill="'+bg+'"/>':"")+c.map(function(t){return '<rect x="'+(18+t[0]*23)+'" y="'+(18+t[1]*23)+'" width="18" height="18" rx="4.5" fill="'+(t[2]||"#ECE8DF")+'"/>'}).join("")+'<rect x="64" y="18" width="18" height="18" rx="4.5" fill="none" stroke="#ECE8DF" stroke-opacity=".28" stroke-width="1.5" stroke-dasharray="3 3"/></svg>'}
function playIntro(){
 var reduce=false;try{reduce=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
 if(reduce||GAMES[location.hash.slice(1)])return;
 var L={0:"c",3:1,6:1,7:1,8:1},h='<div id="intro" role="presentation"><div class="ibox"><div class="ig">';
 for(var i=0;i<9;i++){var cls=L[i]?(L[i]==="c"?"it c":"it"):"it no";h+='<i class="'+cls+'" style="--d:'+(80+i*70)+'ms;--x:'+Math.round(rand(-140,140))+'px;--y:'+Math.round(rand(-260,-80))+'px;--r:'+Math.round(rand(-90,90))+'deg"></i>'}
 h+='</div><div class="iw">'+"Lima Store".split("").map(function(ch,k){return '<span style="--d:'+(1350+k*45)+'ms"'+(k>4?' class="s"':"")+'>'+(ch===" "?"&nbsp;":ch)+'</span>'}).join("")+'</div><div class="itag">Tes créations · Tes apps · Tes jeux</div></div><div class="ihint">Touche pour passer</div></div>';
 document.body.insertAdjacentHTML("beforeend",h);
 var el=document.getElementById("intro");
 el.addEventListener("click",function(){el.classList.add("skip")});
 el.addEventListener("animationend",function(e){if(e.target===el&&/introOut/.test(e.animationName))el.remove()});
 setTimeout(function(){if(el.parentNode)el.remove()},6000);
}

renderStore();
playIntro();
var h0=location.hash.slice(1);if(GAMES[h0])openGame(h0,true);
})();
</script>
