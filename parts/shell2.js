/* ---------- GAME SHELL ---------- */
var cur=null,GM=null,S=null,tab=null,tick=null,lastT=0,lastSig="",lastSave=0,sheetFn=null;
function openGame(id,skipHash){
 closeOverlay();cur=id;GM=GAMES[id];S=gload(id);tab=GM.tabs[0][0];sheetFn=null;
 var gm=$("#game");gm.className=GM.cls;gm.hidden=false;document.body.style.overflow="hidden";
 gm.innerHTML='<div class="wrap"><div class="g-top"><button class="g-back" data-back="1" aria-label="Retour au store"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></button><div class="g-title"><small>Prisme · Tycoon</small><b>'+GM.full+'</b></div></div>'
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
/* Prisme mark: a rounded crystal triangle split into three spectrum facets, with a spark of light at its heart. */
var PF=[["M50 16 86 78 50 57.3Z","#FFB340","#FF2D55","1 0"],["M86 78 14 78 50 57.3Z","#34E07A","#0A84FF","0 1"],["M14 78 50 16 50 57.3Z","#5E5CE6","#D35CFF","-1 0"]];
function prismDefs(){return '<defs><radialGradient id="pmB" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#1E1E3A"/><stop offset="1" stop-color="#06060B"/></radialGradient>'+PF.map(function(f,i){return '<linearGradient id="pmF'+i+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+f[1]+'"/><stop offset="1" stop-color="'+f[2]+'"/></linearGradient>'}).join("")+'<radialGradient id="pmS"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="pmE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><filter id="pmBl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>'}
function prismFacets(cls){return PF.map(function(f,i){var d=f[3].split(" ");return '<path class="'+(cls||"")+'" style="--dx:'+(d[0]*30)+'px;--dy:'+(d[1]*30-(i===0?0:0))+'px;--r:'+(i*40-40)+'deg" d="'+f[0]+'" fill="url(#pmF'+i+')" stroke="url(#pmF'+i+')" stroke-width="7" stroke-linejoin="round"/>'}).join("")}
var PCUTS='<path d="M50 57.3 50 16M50 57.3 86 78M50 57.3 14 78" stroke="#0B0B16" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>';
function prismSpark(cls){return '<g class="'+(cls||"")+'"><circle cx="50" cy="57.3" r="13" fill="url(#pmS)" opacity=".85"/><path d="M50 47.5Q51 56.3 59.8 57.3 51 58.3 50 67.1 49 58.3 40.2 57.3 49 56.3 50 47.5Z" fill="#fff"/></g>'}
function limaLogo(bg){return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+prismDefs()+(bg?'<rect width="100" height="100" fill="url(#pmB)"/>':"")+'<g opacity=".55" filter="url(#pmBl)">'+prismFacets()+'</g>'+prismFacets()+PCUTS+'<path d="M45 27 30 54" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>'+prismSpark()+'</svg>'}
function playIntro(){
 if(REDUCE||GAMES[location.hash.slice(1)])return;
 var h='<div id="lintro" class="pz" role="presentation"><div class="pgrid"></div><div class="pflash"></div><div class="lstage"><svg class="pmark" viewBox="0 0 100 100" overflow="visible">'+prismDefs()
  +'<circle class="pring" cx="50" cy="57.3" r="20" fill="none" stroke="#fff" stroke-width="1.2"/><circle class="pring r2" cx="50" cy="57.3" r="20" fill="none" stroke="#9FB4FF" stroke-width="1"/>'
  +'<path class="pbeam" d="M-90 57.3H50" stroke="url(#pmE)" stroke-width="2.6" stroke-linecap="round" pathLength="100"/>'
  +'<g class="pglow" filter="url(#pmBl)">'+prismFacets("pfac")+'</g>'+prismFacets("pfac")+'<g class="pcuts">'+PCUTS+'</g>'+prismSpark("pspark")+'</svg>'
  +'<div class="pword" data-t="PRISME">PRISME</div><div class="ptag">Toutes tes apps. Une seule lumière.</div></div><div class="pwipe"></div></div>';
 document.body.insertAdjacentHTML("beforeend",h);document.documentElement.classList.add("intro");
 var el=document.getElementById("lintro"),gone=false;
 function end(){if(gone)return;gone=true;el.classList.add("out");document.documentElement.classList.remove("intro");setTimeout(function(){el.remove()},800)}
 el.addEventListener("click",end);setTimeout(end,3600);
}

applyLook();trackDay();renderStore();playIntro();setTimeout(checkTrophies,3200);
var h0=location.hash.slice(1);if(GAMES[h0])openGame(h0,true);
})();
</script>
