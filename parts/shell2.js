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
 if(Date.now()-lastSave>4000){gsave(cur,S);lastSave=Date.now();checkTrophies()}
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
 if(t.dataset.close&&(e.target===t||t.classList.contains("closex"))){closeOverlay();return}
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
/* Lima mark: a lime slice seen from above. 8 rounded segments, pith ring, rind. */
function limeSegs(cls){var s="",n=8,ri=4,ro=25.2,g=11;for(var i=0;i<n;i++){var a0=(i*360/n+g/2-90)*Math.PI/180,a1=((i+1)*360/n-g/2-90)*Math.PI/180;var p=function(r,a){return (50+r*Math.cos(a)).toFixed(2)+" "+(50+r*Math.sin(a)).toFixed(2)};s+='<path class="'+(cls||"")+'" style="--k:'+i+'" d="M'+p(ri+1.5,(a0+a1)/2)+" L"+p(ro,a0)+" A"+ro+" "+ro+" 0 0 1 "+p(ro,a1)+' Z" fill="url(#lmF)" stroke="url(#lmF)" stroke-width="2.2" stroke-linejoin="round"/>'}return s}
function limeDefs(){return '<defs><radialGradient id="lmF" cx="50" cy="50" r="27" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F3FFB8"/><stop offset=".55" stop-color="#C6EE5A"/><stop offset="1" stop-color="#86C92E"/></radialGradient><linearGradient id="lmR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8FD94A"/><stop offset=".6" stop-color="#3FA535"/><stop offset="1" stop-color="#1F7A2C"/></linearGradient><radialGradient id="lmB" cx=".3" cy=".2" r="1"><stop offset="0" stop-color="#26332A"/><stop offset="1" stop-color="#0B0F0C"/></radialGradient></defs>'}
function limaLogo(bg){return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+limeDefs()+(bg?'<rect width="100" height="100" fill="url(#lmB)"/>':"")+'<circle cx="50" cy="50" r="34" fill="url(#lmR)"/><circle cx="50" cy="50" r="30.6" fill="#F8FDEB"/>'+limeSegs()+'<circle cx="50" cy="50" r="2.4" fill="#F8FDEB"/><path d="M27 36a27 27 0 0 1 17-14" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/></svg>'}
function playIntro(){
 if(REDUCE||GAMES[location.hash.slice(1)])return;
 var h='<div id="lintro" role="presentation"><div class="lstage"><svg class="lmark" viewBox="0 0 100 100">'+limeDefs()+'<defs><clipPath id="lmC"><circle cx="50" cy="50" r="34"/></clipPath><linearGradient id="lmS" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'
  +'<g class="lspin"><circle class="lrind" cx="50" cy="50" r="32.3" fill="none" stroke="url(#lmR)" stroke-width="3.4" pathLength="100"/><circle class="lpith" cx="50" cy="50" r="30.6" fill="#F8FDEB"/>'+limeSegs("lseg")+'<circle class="lpith" cx="50" cy="50" r="2.4" fill="#F8FDEB"/></g>'
  +'<g clip-path="url(#lmC)"><rect class="lshine" x="-60" y="-10" width="40" height="120" fill="url(#lmS)" transform="rotate(20 50 50)"/></g></svg>'
  +'<div class="lword">'+"Lima Store".split("").map(function(c,k){return '<span style="--k:'+k+'">'+(c===" "?"&nbsp;":c)+'</span>'}).join("")+'</div><div class="ltag">Tes apps. Tes jeux. Au même endroit.</div></div></div>';
 document.body.insertAdjacentHTML("beforeend",h);document.documentElement.classList.add("intro");
 var el=document.getElementById("lintro"),gone=false;
 function end(){if(gone)return;gone=true;el.classList.add("out");document.documentElement.classList.remove("intro");setTimeout(function(){el.remove()},700)}
 el.addEventListener("click",end);setTimeout(end,3300);
}

applyLook();trackDay();renderStore();playIntro();setTimeout(checkTrophies,3200);
var h0=location.hash.slice(1);if(GAMES[h0])openGame(h0,true);
})();
</script>
