/* ---------- GAME SHELL ---------- */
var cur=null,GM=null,S=null,tab=null,tick=null,lastT=0,lastSig="",lastSave=0,sheetFn=null;
function openGame(id,skipHash){
 closeOverlay();cur=id;GM=GAMES[id];S=gload(id);tab=GM.tabs[0][0];sheetFn=null;
 var gm=$("#game");gm.className=GM.cls;gm.hidden=false;document.body.style.overflow="hidden";
 gm.innerHTML='<div class="wrap"><div class="g-top"><button class="g-back" data-back="1" aria-label="Retour au store"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></button><div class="g-title"><small>Pop · Tycoon</small><b>'+GM.full+'</b></div></div>'
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
/* Pop mark: a glossy soap bubble on a bubblegum gradient, with two little bubbles. */
function popDefs(){return '<defs><linearGradient id="ppB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF5FA2"/><stop offset=".55" stop-color="#FF4D6D"/><stop offset="1" stop-color="#FF9A3C"/></linearGradient><radialGradient id="ppU" cx=".42" cy=".38" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset=".72" stop-color="#fff" stop-opacity=".22"/><stop offset=".86" stop-color="#9FF3FF" stop-opacity=".75"/><stop offset=".93" stop-color="#FFE38A" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity=".95"/></radialGradient></defs>'}
function bubble(cx,cy,r,cls){return '<g class="'+(cls||"")+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#ppU)"/><ellipse cx="'+(cx-r*.36)+'" cy="'+(cy-r*.4)+'" rx="'+(r*.3)+'" ry="'+(r*.17)+'" transform="rotate(-35 '+(cx-r*.36)+' '+(cy-r*.4)+')" fill="#fff" fill-opacity=".9"/><circle cx="'+(cx+r*.42)+'" cy="'+(cy+r*.44)+'" r="'+(r*.07)+'" fill="#fff" fill-opacity=".8"/></g>'}
function limaLogo(bg){return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+popDefs()+(bg?'<rect width="100" height="100" fill="url(#ppB)"/>':"")+bubble(46,54,28)+bubble(77,26,9)+bubble(24,20,5.5)+'</svg>'}
function playIntro(){
 if(REDUCE||GAMES[location.hash.slice(1)])return;
 var b="",dr="";
 for(var i=0;i<22;i++){var s=Math.round(rand(10,46));b+='<i class="pb" style="--x:'+rand(0,100).toFixed(1)+'%;--s:'+s+'px;--d:'+rand(0,1.1).toFixed(2)+'s;--t:'+rand(1.6,2.8).toFixed(2)+'s;--w:'+rand(-30,30).toFixed(0)+'px"></i>'}
 for(var k=0;k<14;k++){var a=k/14*Math.PI*2,r=rand(90,150);dr+='<i class="pd" style="--dx:'+(Math.cos(a)*r).toFixed(0)+'px;--dy:'+(Math.sin(a)*r).toFixed(0)+'px;--s:'+rand(5,12).toFixed(0)+'px"></i>'}
 var h='<div id="lintro" class="pop" role="presentation"><div class="pbs">'+b+'</div><div class="lstage"><div class="pbig"><svg viewBox="0 0 100 100">'+popDefs()+bubble(50,50,46)+'</svg></div><div class="pring2"></div><div class="pdrops">'+dr+'</div>'
  +'<div class="pword2">'+"pop".split("").map(function(c,k){return '<span style="--k:'+k+'">'+c+'</span>'}).join("")+'</div><div class="ptag2">Toutes tes apps, en un pop.</div></div></div>';
 document.body.insertAdjacentHTML("beforeend",h);document.documentElement.classList.add("intro");
 var el=document.getElementById("lintro"),gone=false;
 function end(){if(gone)return;gone=true;el.classList.add("out");document.documentElement.classList.remove("intro");setTimeout(function(){el.remove()},800)}
 el.addEventListener("click",end);setTimeout(end,3300);
}

applyLook();trackDay();renderStore();playIntro();setTimeout(checkTrophies,3200);
var h0=location.hash.slice(1);if(GAMES[h0])openGame(h0,true);
})();
</script>
