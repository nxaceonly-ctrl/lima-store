/* ---------- ICONS (animated) ---------- */
function icn(id){return '<span class="ic" data-i="'+id+'">'+ICON[id]+'</span>'}

/* ---------- STATS ---------- */
function stats(){var s=store.get("lima.stats");if(!s||typeof s!=="object")s={};s.opens=s.opens||{};s.days=s.days||[];return s}
function setStats(s){store.set("lima.stats",s)}
function bump(k,v){var s=stats();s[k]=v===undefined?(s[k]||0)+1:v;setStats(s)}
function trackDay(){var s=stats(),d=new Date().toISOString().slice(0,10);if(s.days.indexOf(d)<0){s.days.push(d);if(s.days.length>60)s.days=s.days.slice(-60)}setStats(s)}
function trackOpen(id){var s=stats();s.opens[id]=(s.opens[id]||0)+1;setStats(s);setTimeout(checkTrophies,300)}
function streak(days){var set={},n=0;days.forEach(function(d){set[d]=1});var t=new Date();for(;;){var k=new Date(t.getTime()-n*864e5).toISOString().slice(0,10);if(set[k])n++;else break}return n}

/* ---------- TROPHIES ---------- */
var TIER={b:["Bronze",10,"#C08457"],a:["Argent",25,"#A7B0BC"],o:["Or",50,"#E3B341"]};
var TROPHIES=[
 ["bienvenue","Bienvenue","Ouvre Lima Store pour la première fois.","b",function(c){return true}],
 ["explorateur","Explorateur","Ouvre 5 créations différentes depuis Lima.","a",function(c){return Object.keys(c.st.opens).length>=5}],
 ["fidele","Fidèle","Viens 3 jours différents.","b",function(c){return c.st.days.length>=3}],
 ["serie","En série","Viens 7 jours d'affilée.","o",function(c){return streak(c.st.days)>=7}],
 ["collection","Collectionneur","Ajoute 3 apps dans Mon iPhone.","b",function(c){return myApps().length>=3}],
 ["fouineur","Fouineur","Utilise la recherche.","b",function(c){return c.st.search>0}],
 ["style","Stylé","Change de fond d'écran.","b",function(c){return c.st.wall>0}],
 ["dj","Premier beat","Ouvre Volta.","b",function(c){return c.st.opens.volta>0}],
 ["batisseur","Bâtisseur","Bastion : construis 6 bâtiments.","b",function(c){return c.b&&c.b.tiles.filter(Boolean).length>=6}],
 ["blindes","Blindés","Bastion : construis le Hangar à blindés.","a",function(c){return c.b&&c.b.tiles.some(function(x){return x&&x.t==="hangar"})}],
 ["sergent","Sergent","Bastion : atteins le grade de Sergent.","a",function(c){return c.b&&c.b.xp>=60}],
 ["colonel","Colonel","Bastion : atteins le grade de Colonel.","o",function(c){return c.b&&c.b.xp>=1600}],
 ["quartier","Premier quartier","Mafia : prends un deuxième quartier.","b",function(c){return c.m&&c.m.own.filter(Boolean).length>=2}],
 ["capo","Capo","Mafia : tiens 4 quartiers.","a",function(c){return c.m&&c.m.own.filter(Boolean).length>=4}],
 ["descente","Chaud devant","Mafia : subis une descente de police.","b",function(c){return c.m&&c.m.raids>0}],
 ["parrain","Parrain","Mafia : prends toute la ville.","o",function(c){return c.m&&(c.m.city>0||c.m.own.every(Boolean))}],
 ["appli","Première appli","Studio : sors ta première appli.","b",function(c){return c.s&&c.s.apps.length>=1}],
 ["equipe","Vraie équipe","Studio : aie 5 personnes dans ton studio.","a",function(c){return c.s&&c.s.staff.length>=5}],
 ["note","Cinq étoiles","Studio : sors une appli notée 4,5 ou plus.","a",function(c){return c.s&&c.s.apps.some(function(a){return a.q>=4.5})}],
 ["top1000","Top 1 000","Studio : entre dans le top 1 000.","a",function(c){return c.s&&c.s.best<=1000}],
 ["numero1","Numéro 1","Studio : atteins la première place du Store.","o",function(c){return c.s&&c.s.best<=1}],
 ["magnat","Magnat","Aie 1 million dans un des tycoons.","o",function(c){return [c.b,c.m,c.s].some(function(x){return x&&x.cash>=1e6})}]
];
var LVL=[0,20,50,100,160,240,330,430,550,700];
function trophyCtx(){var c={st:stats()};c.b=store.get("lima2.bastion");c.m=store.get("lima2.mafia");c.s=store.get("lima2.studio");if(cur){c[{bastion:"b",mafia:"m",studio:"s"}[cur]]=S}return c}
function unlocked(){var u=store.get("lima.trophies");return u&&typeof u==="object"?u:{}}
function xpTotal(u){var x=0;TROPHIES.forEach(function(t){if(u[t[0]])x+=TIER[t[3]][1]});return x}
function levelOf(x){var l=0;while(l<LVL.length-1&&x>=LVL[l+1])l++;var nx=LVL[l+1];return {lv:l+1,x:x,lo:LVL[l],nx:nx,p:nx?(x-LVL[l])/(nx-LVL[l]):1}}
function checkTrophies(){
 var u=unlocked(),c=trophyCtx(),fresh=[];
 TROPHIES.forEach(function(t){if(u[t[0]])return;var ok=false;try{ok=t[4](c)}catch(e){}if(ok){u[t[0]]=Date.now();fresh.push(t)}});
 if(!fresh.length)return;store.set("lima.trophies",u);
 var x=fresh.reduce(function(a,t){return a+TIER[t[3]][1]},0);
 banner(fresh.length===1?fresh[0][1]:fresh.length+" succès débloqués",fresh.length===1?fresh[0][2]:"Niveau "+levelOf(xpTotal(u)).lv+" · ouvre ton profil pour les voir",x,fresh[0][3]);
}
var TROPHY_SVG='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3Zm-1 4v1a2 2 0 0 0 1.1 1.8A5 5 0 0 1 7 9V7Zm12 0v2a5 5 0 0 1-.1.8A2 2 0 0 0 19 8V7Z"/></svg>';
function banner(title,sub,xp,tier){
 var o=document.querySelector(".ban");if(o)o.remove();
 var d=document.createElement("div");d.className="ban";d.setAttribute("role","status");
 d.innerHTML='<span class="bi" style="color:'+TIER[tier][2]+'">'+TROPHY_SVG+'</span><div><small>Succès débloqué · +'+xp+' XP</small><b>'+esc(title)+'</b><span>'+esc(sub)+'</span></div>';
 document.body.appendChild(d);d.addEventListener("click",function(){d.remove();if(!cur)openProfile()});
 setTimeout(function(){d.classList.add("out");setTimeout(function(){d.remove()},500)},4200);
}
function openProfile(){
 var u=unlocked(),L=levelOf(xpTotal(u)),n=Object.keys(u).length;
 var ring=2*Math.PI*44;
 $("#overlay").innerHTML='<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Profil"><div class="grab"></div><button class="closex" data-close="1" aria-label="Fermer">'+XSVG+'</button>'
  +'<div class="prof"><div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--fill)" stroke-width="7"/><circle cx="50" cy="50" r="44" fill="none" stroke="var(--blue)" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+ring+'" stroke-dashoffset="'+(ring*(1-L.p))+'" transform="rotate(-90 50 50)" class="arc"/></svg><span>'+limaLogo("#121316")+'</span></div><div><h5>Seven</h5><small>Niveau '+L.lv+' · '+L.x+' XP</small><small>'+(L.nx?"Encore "+(L.nx-L.x)+" XP pour le niveau "+(L.lv+1):"Niveau maximum")+'</small></div></div>'
  +'<button class="setrow" data-custom="1"><span class="si" style="background:linear-gradient(135deg,#5E5CE6,#BF5AF2)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 16l4-4 3 3 5-6 4 5"/><rect x="3" y="4" width="18" height="16" rx="3"/></svg></span><span class="st">Fond d\'écran et thème</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg></button>'
  +'<h6>Succès <span class="cnt">'+n+' / '+TROPHIES.length+'</span></h6><div class="tro">'+TROPHIES.map(function(t){var on=!!u[t[0]];return '<div class="tr'+(on?" on":"")+'"><span class="bi" style="color:'+(on?TIER[t[3]][2]:"var(--label3)")+'">'+TROPHY_SVG+'</span><b>'+t[1]+'</b><small>'+t[2]+'</small><em>'+TIER[t[3]][0]+' · '+TIER[t[3]][1]+' XP</em></div>'}).join("")+'</div></div>';
}

/* ---------- LOOK: wallpapers, accent, mode, animated icons ---------- */
var WALLS=[["none","Aucun",null],["aurore","Aurore","dark"],["nuit","Nuit étoilée","dark"],["ocean","Océan","dark"],["dune","Dune","light"],["brume","Brume","light"],["graphite","Graphite","dark"]];
var ACCENTS=[["#007AFF","Bleu"],["#5856D6","Indigo"],["#AF52DE","Violet"],["#FF2D55","Rose"],["#FF9500","Orange"],["#34C759","Vert"],["#8E8E93","Graphite"]];
function look(){var l=store.get("lima.look");return l&&typeof l==="object"?l:{wall:"none",accent:"#007AFF",mode:"auto",anim:true}}
var wallRAF=null,wallT0=0;
function applyLook(){
 var l=look(),root=document.documentElement,w=WALLS.filter(function(x){return x[0]===l.wall})[0]||WALLS[0];
 var mode=w[2]||(l.mode==="auto"?null:l.mode);
 if(mode)root.setAttribute("data-theme",mode);else root.removeAttribute("data-theme");
 if(l.accent&&l.accent!=="#007AFF")root.style.setProperty("--blue",l.accent);else root.style.removeProperty("--blue");
 root.classList.toggle("haswall",l.wall!=="none");root.classList.toggle("animicons",l.anim!==false);
 var cv=document.getElementById("wall");
 if(l.wall==="none"){if(cv)cv.remove();cancelAnimationFrame(wallRAF);return}
 if(!cv){cv=document.createElement("canvas");cv.id="wall";cv.setAttribute("aria-hidden","true");document.body.insertBefore(cv,document.body.firstChild)}
 cancelAnimationFrame(wallRAF);wallT0=performance.now();startWall(cv,l.wall);
}
var STARS=null;
function startWall(cv,type){
 var reduce=false;try{reduce=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
 var last=0;
 function fr(now){
  if(document.hidden||(cur&&now-last<1000)){wallRAF=requestAnimationFrame(fr);return}
  if(now-last<40){wallRAF=requestAnimationFrame(fr);return}last=now;
  var W=innerWidth,H=innerHeight;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  drawWall(cv.getContext("2d"),type,W,H,(now-wallT0)/1000);
  if(!reduce)wallRAF=requestAnimationFrame(fr);
 }
 wallRAF=requestAnimationFrame(fr);
}
function blob(c,x,y,r,col){var g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function drawWall(c,type,W,H,t){
 var m=Math.max(W,H);
 if(type==="aurore"){c.fillStyle="#07081A";c.fillRect(0,0,W,H);c.globalCompositeOperation="lighter";
  blob(c,W*(.3+.2*Math.sin(t*.13)),H*(.25+.1*Math.cos(t*.1)),m*.6,"rgba(64,72,255,.55)");
  blob(c,W*(.75+.15*Math.cos(t*.11)),H*(.45+.15*Math.sin(t*.09)),m*.55,"rgba(191,90,242,.45)");
  blob(c,W*(.45+.25*Math.sin(t*.07+1)),H*(.85+.08*Math.sin(t*.12)),m*.6,"rgba(48,209,160,.38)");
  c.globalCompositeOperation="source-over";return}
 if(type==="nuit"){var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#05060F");g.addColorStop(1,"#18163A");c.fillStyle=g;c.fillRect(0,0,W,H);
  if(!STARS){STARS=[];for(var i=0;i<160;i++)STARS.push([Math.random(),Math.random(),Math.random()*1.3+.3,Math.random()*6])}
  STARS.forEach(function(s){var a=.35+.65*Math.abs(Math.sin(t*.8+s[3]));c.globalAlpha=a;c.fillStyle="#fff";c.beginPath();c.arc(((s[0]+t*.002)%1)*W,s[1]*H,s[2],0,7);c.fill()});
  c.globalAlpha=1;blob(c,W*.8,H*.15,m*.35,"rgba(120,110,255,.18)");return}
 if(type==="ocean"){var g2=c.createLinearGradient(0,0,0,H);g2.addColorStop(0,"#021627");g2.addColorStop(1,"#063A5C");c.fillStyle=g2;c.fillRect(0,0,W,H);
  for(var k=0;k<6;k++){c.beginPath();var base=H*(.45+k*.1);c.moveTo(0,H);for(var x=0;x<=W;x+=8)c.lineTo(x,base+Math.sin(x/(90+k*20)+t*(.5+k*.12)+k)*(10+k*3));c.lineTo(W,H);c.closePath();c.fillStyle="rgba(40,170,230,"+(.05+k*.025)+")";c.fill()}return}
 if(type==="dune"){var g3=c.createLinearGradient(0,0,0,H);g3.addColorStop(0,"#FBE3C8");g3.addColorStop(1,"#F2B488");c.fillStyle=g3;c.fillRect(0,0,W,H);blob(c,W*.75,H*.18,m*.25,"rgba(255,255,255,.7)");
  var cols=["#EDB07E","#E29A6A","#D6845A","#C8714C"];for(var d=0;d<4;d++){c.beginPath();var b=H*(.55+d*.12);c.moveTo(0,H);for(var x2=0;x2<=W;x2+=8)c.lineTo(x2,b+Math.sin(x2/(160-d*20)+d*2+t*.05)*(24-d*3));c.lineTo(W,H);c.closePath();c.fillStyle=cols[d];c.globalAlpha=.75;c.fill()}c.globalAlpha=1;return}
 if(type==="brume"){c.fillStyle="#EEF0F7";c.fillRect(0,0,W,H);
  blob(c,W*(.2+.1*Math.sin(t*.1)),H*.2,m*.55,"rgba(255,182,193,.55)");blob(c,W*.85,H*(.4+.1*Math.cos(t*.08)),m*.5,"rgba(173,216,255,.6)");blob(c,W*(.5+.2*Math.cos(t*.06)),H*.9,m*.55,"rgba(200,190,255,.55)");return}
 c.fillStyle="#141416";c.fillRect(0,0,W,H);blob(c,W*(.5+.3*Math.sin(t*.05)),H*.3,m*.7,"rgba(255,255,255,.07)");
}
function openCustom(){
 var l=look();
 $("#overlay").innerHTML='<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Fond d\'écran et thème"><div class="grab"></div><button class="closex" data-close="1" aria-label="Fermer">'+XSVG+'</button><h5 class="shh">Fond d\'écran et thème</h5>'
  +'<div class="lbl2">Fond d\'écran</div><div class="walls">'+WALLS.map(function(w){return '<button class="wopt'+(l.wall===w[0]?" on":"")+'" data-wall="'+w[0]+'"><canvas data-prev="'+w[0]+'" width="70" height="120"></canvas><b>'+w[1]+'</b></button>'}).join("")+'</div>'
  +'<div class="lbl2">Couleur</div><div class="accents">'+ACCENTS.map(function(a){return '<button class="acc'+(l.accent===a[0]?" on":"")+'" data-accent="'+a[0]+'" style="background:'+a[0]+'" aria-label="'+a[1]+'"></button>'}).join("")+'</div>'
  +'<div class="lbl2">Apparence'+(l.wall!=="none"?" · réglée par le fond d'écran":"")+'</div><div class="segc">'+[["auto","Auto"],["light","Clair"],["dark","Sombre"]].map(function(m){return '<button data-mode="'+m[0]+'" class="'+(l.mode===m[0]?"on":"")+'" '+(l.wall!=="none"?"disabled":"")+'>'+m[1]+'</button>'}).join("")+'</div>'
  +'<div class="grouprow"><span>Icônes animées</span><button class="sw'+(l.anim!==false?" on":"")+'" data-anim="1" role="switch" aria-checked="'+(l.anim!==false)+'" aria-label="Icônes animées"><i></i></button></div><div class="note">Les icônes bougent doucement : l\'aiguille d\'Azimut, le soleil de Ciel, les pads de Volta…</div></div>';
 document.querySelectorAll("canvas[data-prev]").forEach(function(cv){var c=cv.getContext("2d");if(cv.dataset.prev==="none"){c.fillStyle=getComputedStyle(document.body).backgroundColor;c.fillRect(0,0,70,120);c.strokeStyle="rgba(128,128,128,.6)";c.beginPath();c.moveTo(10,110);c.lineTo(60,10);c.stroke()}else drawWall(c,cv.dataset.prev,70,120,3)});
}
function setLook(k,v){var l=look();l[k]=v;store.set("lima.look",l);applyLook()}

/* ---------- SPOTLIGHT ---------- */
function norm(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")}
function searchItems(){
 var it=[];
 APPS.forEach(function(a){it.push({k:"Mes créations",n:a.name,sub:a.cat,kw:a.tag+" "+a.desc+" "+a.cat,html:icn(a.id),act:'data-app="'+a.id+'"',btn:"OUVRIR",href:a.url,track:a.id})});
 GIDS.forEach(function(id){var g=GAMES[id];it.push({k:"Jeux",n:g.full,sub:"Tycoon",kw:"tycoon jeu "+g.tag,html:icn(id),act:'data-game="'+id+'"',btn:"JOUER"})});
 myApps().forEach(function(a,k){it.push({k:"Mon iPhone",n:a.n,sub:"App de ton iPhone",kw:a.u,html:'<span class="ic">'+letterIcon(a)+'</span>',href:a.u,btn:"OUVRIR"})});
 [["Mes succès","profil trophees niveau xp","data-profile=\"1\""],["Fond d'écran et thème","personnaliser couleur sombre clair theme wallpaper","data-custom=\"1\""],["Ajouter une app","youtube tiktok instagram snapchat ajouter","data-add=\"1\""],["Dossier Tycoon","bastion mafia studio","data-folder=\"1\""]].forEach(function(a){it.push({k:"Raccourcis",n:a[0],sub:"Lima",kw:a[1],html:'<span class="ic sic">'+limaLogo("#121316")+'</span>',act:a[2]})});
 return it;
}
function openSearch(){
 bump("search");setTimeout(checkTrophies,400);
 $("#overlay").innerHTML='<div class="spot"><div class="spbar"><label class="spf"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/></svg><input id="spq" type="search" placeholder="Apps, jeux, réglages…" autocomplete="off" autocapitalize="none" enterkeyhint="go"></label><button class="spx" data-close="1">Annuler</button></div><div class="spres" id="spres"></div></div>';
 var q=$("#spq");q.addEventListener("input",function(){renderSearch(q.value)});
 q.addEventListener("keydown",function(e){if(e.key==="Enter"){var f=document.querySelector("#spres .hit [data-go]");if(f)f.click()}});
 renderSearch("");setTimeout(function(){q.focus()},60);
}
function hitRow(x,big){
 var right=x.href?'<a class="pill" data-go="1" '+(x.track?'data-track="'+x.track+'" ':"")+'href="'+esc(x.href)+'"'+(/^https?:|^apps\//.test(x.href)?' target="_blank" rel="noopener"':"")+'>'+x.btn+'</a>':'<button class="pill" data-go="1" '+x.act+'>'+(x.btn||"OUVRIR")+'</button>';
 return '<div class="arow'+(big?" hit":"")+'"><button class="spm" '+(x.act||'data-noop="1"')+'>'+x.html+'<span class="t"><b>'+esc(x.n)+'</b><small>'+esc(x.sub)+'</small></span></button>'+right+'</div>';
}
function renderSearch(qs){
 var el=$("#spres"),q=norm(qs.trim()),items=searchItems();
 if(!q){
  var s=stats(),top=APPS.slice().sort(function(a,b){return (s.opens[b.id]||0)-(s.opens[a.id]||0)}).slice(0,4);
  el.innerHTML='<div class="sph">Suggestions</div><div class="grid">'+top.map(function(a){return '<button class="app" data-app="'+a.id+'">'+icn(a.id)+'<b>'+a.name+'</b></button>'}).join("")+'</div><div class="sph">Raccourcis</div><div class="groupcard">'+items.filter(function(x){return x.k==="Raccourcis"}).map(function(x){return hitRow(x)}).join("")+'</div>';return}
 var scored=items.map(function(x){var n=norm(x.n),sc=n.indexOf(q)===0?3:n.indexOf(q)>=0?2:norm(x.kw+" "+x.sub).indexOf(q)>=0?1:0;return [sc,x]}).filter(function(a){return a[0]>0}).sort(function(a,b){return b[0]-a[0]});
 if(!scored.length){el.innerHTML='<div class="spnone"><b>Aucun résultat</b><span>pour « '+esc(qs)+' »</span></div>';return}
 var h='<div class="sph">Meilleur résultat</div><div class="groupcard">'+hitRow(scored[0][1],true)+'</div>',groups={};
 scored.slice(1).forEach(function(a){(groups[a[1].k]=groups[a[1].k]||[]).push(a[1])});
 Object.keys(groups).forEach(function(k){h+='<div class="sph">'+k+'</div><div class="groupcard">'+groups[k].map(function(x){return hitRow(x)}).join("")+'</div>'});
 el.innerHTML=h;
}

/* ---------- EVENTS for extras ---------- */
document.addEventListener("click",function(e){
 var t=e.target.closest("[data-search],[data-profile],[data-custom],[data-wall],[data-accent],[data-mode],[data-anim],[data-track],.grid a.app");if(!t)return;
 if(t.dataset.track){trackOpen(t.dataset.track);return}
 if(t.matches(".grid a.app")){bump("phoneOpens");return}
 if(t.dataset.search){openSearch();return}
 if(t.dataset.profile){openProfile();return}
 if(t.dataset.custom){openCustom();return}
 if(t.dataset.wall){setLook("wall",t.dataset.wall);if(t.dataset.wall!=="none")bump("wall");openCustom();setTimeout(checkTrophies,400);return}
 if(t.dataset.accent){setLook("accent",t.dataset.accent);openCustom();return}
 if(t.dataset.mode){if(t.disabled)return;setLook("mode",t.dataset.mode);openCustom();return}
 if(t.dataset.anim){setLook("anim",!(look().anim!==false));openCustom();return}
},true);
