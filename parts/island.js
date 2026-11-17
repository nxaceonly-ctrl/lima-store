
/* ---------- ISLAND (Pop world you explore with your finger) ---------- */
var WORLD=1400,ISC={x:700,y:720};
var DISTRICTS=[
 {k:"arcade",name:"Quartier Arcade",at:[930,300],col:"#7C5CFF",ids:[["breche",905,440],["qg",1050,560],["nocta",770,330],["frequence",1090,730],["champion",950,640]]},
 {k:"tycoon",name:"Quartier Tycoon",at:[960,1180],col:"#E8A33D",ids:[["bastion",880,960],["mafia",1040,880],["studio",800,1090]]},
 {k:"vie",name:"Quartier Vie",at:[380,420],col:"#2FBF71",ids:[["ascendant",440,560],["ciel",580,420],["azimut",380,770],["velours",530,920]]},
 {k:"son",name:"Studio son",at:[1180,430],col:"#FF4D8D",ids:[["volta",1160,560]]},
 {k:"cine",name:"Cinéma",at:[360,1130],col:"#FF453A",ids:[["kino",450,1060]]}
];
function islandR(a){return 560+40*Math.sin(3*a)+26*Math.sin(5*a+1)+14*Math.sin(9*a+2)}
function isl(){return {cam:{x:0,y:0,s:.8},v:{x:0,y:0},sel:null}}
var IS=null;
function viewIsland(){
 var night=(function(h){return h>=19||h<7})(new Date().getHours());
 var h='<div class="island'+(night?" night":"")+'" id="island"><div class="iworld" id="iworld" style="width:'+WORLD+'px;height:'+WORLD+'px"><canvas id="iterrain" width="'+WORLD+'" height="'+WORLD+'"></canvas>';
 h+='<div class="fountain" style="left:'+ISC.x+'px;top:'+ISC.y+'px"><span class="fb">'+limaLogo()+'</span>'+[0,1,2,3,4,5].map(function(i){return '<i style="--i:'+i+'"></i>'}).join("")+'<b>Pop</b></div>';
 DISTRICTS.forEach(function(d){
  h+='<div class="dsign" style="left:'+d.at[0]+'px;top:'+d.at[1]+'px;--c:'+d.col+'">'+d.name+'</div>';
  d.ids.forEach(function(b){var it=item(b[0]);var lv=bldLevel(b[0]);h+='<button class="bld lv'+lv+'" data-bld="'+b[0]+'" style="left:'+b[1]+'px;top:'+b[2]+'px;--c:'+d.col+';--dl:'+(Math.random()*2).toFixed(2)+'s"><span class="sh"></span><span class="plinth"></span><span class="floor"></span><span class="tile">'+icn(b[0])+(lv===3?'<i class="crown"></i>':'')+'</span><b>'+esc(it.name.replace(" Tycoon",""))+'<em>Niv. '+lv+'</em></b></button>'});
 });
 var mine=myApps(),spots=[[170,260],[1250,1230],[150,1080],[1290,250],[700,90],[640,1330],[90,640],[1330,820]];
 mine.slice(0,8).forEach(function(a,i){var p=spots[i];h+='<a class="boat" href="'+esc(a.u)+'"'+(/^https?:/i.test(a.u)?' target="_blank" rel="noopener"':"")+' style="left:'+p[0]+'px;top:'+p[1]+'px;--dl:'+(i*.7)+'s"><span class="hull"></span><span class="sail">'+letterIcon(a)+'</span><b>'+esc(a.n)+'</b></a>'});
 if(mine.length<8){var p=spots[mine.length];h+='<button class="boat add" data-add="1" style="left:'+p[0]+'px;top:'+p[1]+'px"><span class="hull"></span><span class="sail"><span class="letter" style="background:rgba(255,255,255,.85);color:#FF4D6D">+</span></span><b>Ajouter</b></button>'}
 h+=islandExtras();h+='<div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div></div>';
 h+='<div class="itop"><div class="ibrand"><span class="ilogo">'+limaLogo(1)+'</span><div><b>Île de Pop</b><small>'+(night?"Bonne nuit":"Touche l\'île pour marcher")+'</small></div></div>'+hudHTML()+'</div><button class="wxchip" id="wxchip">Météo</button>';
 h+='<button class="irecenter" data-recenter="1" aria-label="Revenir au centre"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button>';
 h+='<button class="ibuild" aria-label="Construire"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6 4 4M4 20l9.5-9.5M12.5 4.5l7 7-2 2-7-7Z"/></svg></button><div class="icard" id="icard"></div><div class="ishop" id="ishop"></div></div>';
 return h;
}
function drawTerrain(cv){
 var c=cv.getContext("2d"),W=WORLD,cx=ISC.x,cy=ISC.y;
 var rnd=(function(s){return function(){s=(s*16807)%2147483647;return s/2147483647}})(7);
 function shape(off){c.beginPath();for(var i=0;i<=180;i++){var a=i/180*Math.PI*2,r=islandR(a)+off;var x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.92;i?c.lineTo(x,y):c.moveTo(x,y)}c.closePath()}
 c.clearRect(0,0,W,W);
 // shallow water + foam
 shape(90);c.fillStyle="rgba(120,230,235,.35)";c.fill();
 shape(38);c.fillStyle="rgba(170,245,240,.55)";c.fill();
 shape(14);c.lineWidth=6;c.strokeStyle="rgba(255,255,255,.7)";c.stroke();
 // sand
 shape(0);var g=c.createRadialGradient(cx,cy,200,cx,cy,620);g.addColorStop(0,"#F7E3B5");g.addColorStop(1,"#EBCB8B");c.fillStyle=g;c.fill();
 // grass
 shape(-52);var g2=c.createRadialGradient(cx-120,cy-140,60,cx,cy,600);g2.addColorStop(0,"#9BE07A");g2.addColorStop(.6,"#6CC65A");g2.addColorStop(1,"#4FA94A");c.fillStyle=g2;c.fill();
 c.save();shape(-52);c.clip();
 for(var i=0;i<900;i++){var x=rnd()*W,y=rnd()*W;c.fillStyle=rnd()<.5?"rgba(40,110,40,.10)":"rgba(255,255,255,.07)";c.beginPath();c.ellipse(x,y,6+rnd()*14,4+rnd()*8,rnd()*3,0,7);c.fill()}
 // district lawns
 DISTRICTS.forEach(function(d){var mx=0,my=0;d.ids.forEach(function(b){mx+=b[1];my+=b[2]});mx/=d.ids.length;my/=d.ids.length;var r=d.ids.length>1?170:110;var gg=c.createRadialGradient(mx,my,10,mx,my,r);gg.addColorStop(0,d.col+"33");gg.addColorStop(1,d.col+"00");c.fillStyle=gg;c.beginPath();c.arc(mx,my,r,0,7);c.fill()});
 c.restore();
 // paths
 var stops=[];DISTRICTS.forEach(function(d){d.ids.forEach(function(b){stops.push([b[1],b[2]])})});
 function path(x1,y1,x2,y2,w){var mx=(x1+x2)/2+(y2-y1)*.18,my=(y1+y2)/2-(x2-x1)*.18;c.lineCap="round";c.lineWidth=w+8;c.strokeStyle="rgba(150,110,60,.25)";c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo(mx,my,x2,y2);c.stroke();c.lineWidth=w;c.strokeStyle="#F3DDAE";c.stroke();c.setLineDash([2,14]);c.lineWidth=3;c.strokeStyle="rgba(170,130,80,.35)";c.stroke();c.setLineDash([])}
 stops.forEach(function(s){path(cx,cy,s[0],s[1],22)});
 // plaza
 c.fillStyle="#EFE4CF";c.beginPath();c.arc(cx,cy,92,0,7);c.fill();c.strokeStyle="rgba(150,120,80,.3)";c.lineWidth=3;for(var r=30;r<92;r+=20){c.beginPath();c.arc(cx,cy,r,0,7);c.stroke()}
 var pg=c.createRadialGradient(cx-14,cy-14,6,cx,cy,58);pg.addColorStop(0,"#9FF0FF");pg.addColorStop(1,"#2BA9D6");c.fillStyle="#D9CBB0";c.beginPath();c.arc(cx,cy,64,0,7);c.fill();c.fillStyle=pg;c.beginPath();c.arc(cx,cy,56,0,7);c.fill();c.strokeStyle="rgba(255,255,255,.6)";c.lineWidth=2;c.beginPath();c.arc(cx,cy,42,0,7);c.stroke();
 stops.forEach(function(s){c.fillStyle="rgba(239,228,207,.9)";c.beginPath();c.ellipse(s[0],s[1]+34,62,30,0,0,7);c.fill()});
 // trees
 var trees=0;for(var k=0;k<2000&&trees<150;k++){var a=rnd()*Math.PI*2,rr=rnd()*(islandR(a)-80),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.92;
  if(Math.hypot(x-cx,y-cy)<140)continue;var ok=true;stops.forEach(function(s){if(Math.hypot(x-s[0],y-s[1])<95)ok=false});DISTRICTS.forEach(function(d){if(Math.hypot(x-d.at[0],y-d.at[1])<70)ok=false});if(!ok)continue;
  var nearPath=false;stops.forEach(function(s){var t=((x-cx)*(s[0]-cx)+(y-cy)*(s[1]-cy))/((s[0]-cx)*(s[0]-cx)+(s[1]-cy)*(s[1]-cy));if(t>0&&t<1){var px=cx+t*(s[0]-cx),py=cy+t*(s[1]-cy);if(Math.hypot(x-px,y-py)<40)nearPath=true}});if(nearPath)continue;
  trees++;var sz=14+rnd()*12;c.fillStyle="rgba(20,70,30,.22)";c.beginPath();c.ellipse(x+sz*.4,y+sz*.7,sz*1.1,sz*.5,0,0,7);c.fill();
  var pine=rnd()<.35;if(pine){c.fillStyle="#2F7D3E";c.beginPath();c.moveTo(x,y-sz*1.6);c.lineTo(x+sz*.8,y+sz*.4);c.lineTo(x-sz*.8,y+sz*.4);c.fill();c.fillStyle="#3E9A4C";c.beginPath();c.moveTo(x,y-sz*1.6);c.lineTo(x+sz*.15,y+sz*.4);c.lineTo(x-sz*.8,y+sz*.4);c.fill()}
  else{c.fillStyle="#3C8F45";c.beginPath();c.arc(x,y,sz,0,7);c.fill();c.fillStyle="#58B05A";c.beginPath();c.arc(x-sz*.25,y-sz*.3,sz*.7,0,7);c.fill();c.fillStyle="rgba(255,255,255,.18)";c.beginPath();c.arc(x-sz*.4,y-sz*.5,sz*.28,0,7);c.fill()}}
 // beach rocks + palms
 for(var q=0;q<26;q++){var a2=rnd()*Math.PI*2,r2=islandR(a2)-22+rnd()*14,x2=cx+Math.cos(a2)*r2,y2=cy+Math.sin(a2)*r2*.92;if(rnd()<.5){c.fillStyle="#B9B2A6";c.beginPath();c.ellipse(x2,y2,7+rnd()*7,5+rnd()*4,rnd()*3,0,7);c.fill();c.fillStyle="rgba(255,255,255,.35)";c.beginPath();c.ellipse(x2-2,y2-2,3,2,0,0,7);c.fill()}else{c.strokeStyle="#8A6A42";c.lineWidth=3;c.beginPath();c.moveTo(x2,y2);c.quadraticCurveTo(x2+4,y2-12,x2+2,y2-22);c.stroke();c.fillStyle="#3FA34D";for(var f=0;f<5;f++){var fa=f/5*Math.PI*2;c.beginPath();c.ellipse(x2+2+Math.cos(fa)*8,y2-22+Math.sin(fa)*5,9,3,fa,0,7);c.fill()}}}
 // pier
 c.fillStyle="#B98A55";var pa=2.2,pr=islandR(pa)-10,px0=cx+Math.cos(pa)*pr,py0=cy+Math.sin(pa)*pr*.92;c.save();c.translate(px0,py0);c.rotate(pa);c.fillRect(0,-9,120,18);c.fillStyle="rgba(0,0,0,.15)";for(var z=8;z<120;z+=14)c.fillRect(z,-9,2,18);c.restore();
}
function applyCam(){var w=$("#iworld");if(!w||!IS)return;var c=IS.cam;w.style.transform="translate3d("+c.x.toFixed(1)+"px,"+c.y.toFixed(1)+"px,0) scale("+c.s.toFixed(4)+")"}
function clampCam(){var c=IS.cam,el=$("#island");if(!el)return;var W=el.clientWidth,H=el.clientHeight,m=120;var ww=WORLD*c.s;
 var minX=W-ww-m,maxX=m,minY=H-ww-m,maxY=m;if(ww+2*m<W){minX=maxX=(W-ww)/2}if(ww+2*m<H){minY=maxY=(H-ww)/2}c.x=Math.max(minX,Math.min(maxX,c.x));c.y=Math.max(minY,Math.min(maxY,c.y))}
function focusOn(x,y,s,dur){var el=$("#island");if(!el)return;var W=el.clientWidth,H=el.clientHeight,c0={x:IS.cam.x,y:IS.cam.y,s:IS.cam.s};s=s||c0.s;var tx=W/2-x*s,ty=H*.44-y*s,t0=performance.now();dur=REDUCE?1:(dur||700);
 cancelAnimationFrame(IS.raf);(function st(now){var p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);IS.cam.x=c0.x+(tx-c0.x)*e;IS.cam.y=c0.y+(ty-c0.y)*e;IS.cam.s=c0.s+(s-c0.s)*e;applyCam();if(p<1)IS.raf=requestAnimationFrame(st)})(t0)}
function initIsland(){
 var el=$("#island");if(!el)return;IS=isl();BUILD=null;loadWeather(false);
 el.addEventListener("scroll",function(){if(el.scrollTop||el.scrollLeft){el.scrollTop=0;el.scrollLeft=0}});
 var cv=$("#iterrain");drawTerrain(cv);
 var W=el.clientWidth,H=el.clientHeight;var s0=Math.min(W,H)/WORLD*.95;IS.cam={x:W/2-ISC.x*s0,y:H/2-ISC.y*s0,s:s0};applyCam();
 setTimeout(function(){if(IS)focusOn(ISC.x,ISC.y+40,Math.max(.62,Math.min(.9,W/560)),1400)},document.getElementById("lintro")?3300:250);
 var pts={},last=null,moved=0,pinch=null,vel={x:0,y:0},lt=0;
 function pmid(){var k=Object.keys(pts);return k.length<2?null:{x:(pts[k[0]].x+pts[k[1]].x)/2,y:(pts[k[0]].y+pts[k[1]].y)/2,d:Math.hypot(pts[k[0]].x-pts[k[1]].x,pts[k[0]].y-pts[k[1]].y)}}
 el.addEventListener("pointerdown",function(e){if(e.target.closest(".icard,.itop,.irecenter"))return;cancelAnimationFrame(IS.raf);pts[e.pointerId]={x:e.clientX,y:e.clientY};if(Object.keys(pts).length===1){last={x:e.clientX,y:e.clientY};moved=0;vel={x:0,y:0};lt=performance.now()}else{pinch={m:pmid(),s:IS.cam.s,x:IS.cam.x,y:IS.cam.y}}});
 el.addEventListener("pointermove",function(e){if(!pts[e.pointerId])return;pts[e.pointerId]={x:e.clientX,y:e.clientY};
  if(pinch){var m=pmid();if(!m)return;var r=el.getBoundingClientRect(),ns=Math.max(.35,Math.min(1.8,pinch.s*m.d/pinch.m.d));var wx=(pinch.m.x-r.left-pinch.x)/pinch.s,wy=(pinch.m.y-r.top-pinch.y)/pinch.s;IS.cam.s=ns;IS.cam.x=m.x-r.left-wx*ns;IS.cam.y=m.y-r.top-wy*ns;moved=99;clampCam();applyCam();return}
  if(!last)return;var dx=e.clientX-last.x,dy=e.clientY-last.y,now=performance.now();moved+=Math.abs(dx)+Math.abs(dy);IS.cam.x+=dx;IS.cam.y+=dy;var dt=Math.max(1,now-lt);vel={x:dx/dt*16,y:dy/dt*16};lt=now;last={x:e.clientX,y:e.clientY};clampCam();applyCam();if(moved>8)el.classList.add("drag")});
 function up(e){if(!pts[e.pointerId])return;delete pts[e.pointerId];var n=Object.keys(pts).length;if(n<2)pinch=null;if(n===1){var k=Object.keys(pts)[0];last={x:pts[k].x,y:pts[k].y};return}
  if(n===0){last=null;setTimeout(function(){el.classList.remove("drag")},0);if(moved>8){IS.dragged=performance.now();if(!REDUCE&&performance.now()-lt<80){(function glide(){vel.x*=.93;vel.y*=.93;IS.cam.x+=vel.x;IS.cam.y+=vel.y;clampCam();applyCam();if(Math.abs(vel.x)+Math.abs(vel.y)>.3)IS.raf=requestAnimationFrame(glide)})()}}}}
 el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
 el.addEventListener("wheel",function(e){e.preventDefault();var r=el.getBoundingClientRect(),ns=Math.max(.35,Math.min(1.8,IS.cam.s*Math.exp(-e.deltaY*.0015)));var wx=(e.clientX-r.left-IS.cam.x)/IS.cam.s,wy=(e.clientY-r.top-IS.cam.y)/IS.cam.s;IS.cam.s=ns;IS.cam.x=e.clientX-r.left-wx*ns;IS.cam.y=e.clientY-r.top-wy*ns;clampCam();applyCam()},{passive:false});
}
function selectBld(id){
 var b=document.querySelector('.bld[data-bld="'+id+'"]');if(!b)return;
 document.querySelectorAll(".bld.on").forEach(function(x){x.classList.remove("on")});b.classList.add("on");
 var it=item(id);IS.sel=id;
 var card=$("#icard");card.innerHTML='<div class="icin">'+icn(id)+'<div class="t"><b>'+esc(it.name)+'</b><small>'+esc(sub(id))+'</small></div>'+getBtn(id,"solid")+'</div><button class="link" data-detail="'+id+'">Voir la fiche</button><button class="icx" data-icx="1" aria-label="Fermer">'+XSVG+'</button>';
 card.classList.remove("show");void card.offsetWidth;card.classList.add("show");
 focusOn(parseFloat(b.style.left),parseFloat(b.style.top)+60,Math.max(IS.cam.s,.95),650);
 walkTo(parseFloat(b.style.left)-60,parseFloat(b.style.top)+70);
}
document.addEventListener("click",function(e){
 if(!IS||stab!=="island")return;
 if(IS.dragged&&performance.now()-IS.dragged<250&&e.target.closest("#island")){if(!e.target.closest(".icard,.itop,.irecenter")){e.stopPropagation();e.preventDefault();return}}
 var b=e.target.closest("[data-bld]");if(b){selectBld(b.dataset.bld);return}
 if(e.target.closest("[data-icx]")){$("#icard").classList.remove("show");document.querySelectorAll(".bld.on").forEach(function(x){x.classList.remove("on")});return}
 if(e.target.closest("[data-recenter]")){focusOn(ISC.x,ISC.y+40,Math.max(.62,Math.min(.9,$("#island").clientWidth/560)),800);return}
 if(e.target.closest(".fountain")){var w=$("#island");w.classList.remove("burst");void w.offsetWidth;w.classList.add("burst");return}
},true);

/* ---------- ISLAND v2: avatar, coins, growth, chest, weather, building ---------- */
function isave(){var s=store.get("pop.isle");if(!s||typeof s!=="object")s={};if(typeof s.coins!=="number")s.coins=50;s.pos=s.pos||{x:ISC.x-40,y:ISC.y+120};s.placed=Array.isArray(s.placed)?s.placed:[];s.paid=s.paid||{};s.chest=s.chest||{};return s}
function iput(s){store.set("pop.isle",s)}
function today(){return new Date().toISOString().slice(0,10)}
function bldLevel(id){var n=opens(id);return n>=10?3:n>=3?2:1}
var COIN='<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="#FFC93C"/><circle cx="12" cy="12" r="7.2" fill="#FFB000"/><path d="M10 8.5h3.2a2.2 2.2 0 0 1 0 4.4H10V8.5Zm0 4.4v3.1" stroke="#FFF3C4" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
var DECOR={
 flowers:{n:"Fleurs",p:5,svg:'<svg viewBox="0 0 40 30"><g><circle cx="10" cy="18" r="5" fill="#FF6FA8"/><circle cx="10" cy="18" r="2" fill="#FFE27A"/><circle cx="22" cy="12" r="5" fill="#FFFFFF"/><circle cx="22" cy="12" r="2" fill="#FFB000"/><circle cx="31" cy="20" r="5" fill="#9B7BFF"/><circle cx="31" cy="20" r="2" fill="#FFE27A"/></g></svg>'},
 tree:{n:"Arbre",p:10,svg:'<svg viewBox="0 0 40 50"><ellipse cx="22" cy="46" rx="14" ry="4" fill="rgba(20,70,30,.25)"/><rect x="18" y="30" width="5" height="16" rx="2" fill="#8A6A42"/><circle cx="20" cy="22" r="15" fill="#3C8F45"/><circle cx="16" cy="17" r="10" fill="#58B05A"/><circle cx="13" cy="13" r="3.5" fill="rgba(255,255,255,.25)"/></svg>'},
 palm:{n:"Palmier",p:15,svg:'<svg viewBox="0 0 40 50"><ellipse cx="22" cy="47" rx="12" ry="3.5" fill="rgba(20,70,30,.25)"/><path d="M21 46q3-16-1-30" stroke="#8A6A42" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#3FA34D"><ellipse cx="11" cy="15" rx="11" ry="4" transform="rotate(20 11 15)"/><ellipse cx="29" cy="15" rx="11" ry="4" transform="rotate(-20 29 15)"/><ellipse cx="20" cy="10" rx="4" ry="10"/><ellipse cx="12" cy="9" rx="9" ry="3.5" transform="rotate(-25 12 9)"/><ellipse cx="28" cy="9" rx="9" ry="3.5" transform="rotate(25 28 9)"/></g></svg>'},
 lamp:{n:"Lampadaire",p:25,svg:'<svg viewBox="0 0 30 60"><ellipse cx="15" cy="57" rx="8" ry="2.5" fill="rgba(0,0,0,.2)"/><rect x="13" y="16" width="4" height="40" rx="2" fill="#3A3F4A"/><circle class="lit" cx="15" cy="12" r="7" fill="#FFE9A8"/><path d="M8 12a7 7 0 0 1 14 0" fill="#3A3F4A"/></svg>'},
 bench:{n:"Banc",p:20,svg:'<svg viewBox="0 0 50 30"><ellipse cx="25" cy="27" rx="20" ry="3" fill="rgba(0,0,0,.18)"/><rect x="6" y="8" width="38" height="5" rx="2" fill="#B5793F"/><rect x="5" y="15" width="40" height="5" rx="2" fill="#C98A4B"/><rect x="9" y="20" width="3" height="7" fill="#5A3E22"/><rect x="38" y="20" width="3" height="7" fill="#5A3E22"/></svg>'},
 bridge:{n:"Pont",p:40,water:1,svg:'<svg viewBox="0 0 80 34"><rect x="2" y="12" width="76" height="14" rx="4" fill="#B98A55"/><g fill="#9A6E3E">'+[8,18,28,38,48,58,68].map(function(x){return '<rect x="'+x+'" y="12" width="2" height="14"/>'}).join("")+'</g><rect x="2" y="6" width="76" height="3" rx="1.5" fill="#7A5530"/><rect x="2" y="28" width="76" height="3" rx="1.5" fill="#7A5530"/></svg>'},
 statue:{n:"Statue",p:80,svg:'<svg viewBox="0 0 40 60"><ellipse cx="20" cy="57" rx="14" ry="3.5" fill="rgba(0,0,0,.2)"/><rect x="8" y="40" width="24" height="16" rx="3" fill="#D9D3C7"/><rect x="6" y="38" width="28" height="5" rx="2" fill="#EEE8DC"/><circle cx="20" cy="22" r="15" fill="url(#ppU)"/><circle cx="20" cy="22" r="15" fill="#FFD36B" opacity=".55"/><ellipse cx="15" cy="16" rx="4.5" ry="2.6" transform="rotate(-35 15 16)" fill="#fff" opacity=".9"/></svg>'},
 lighthouse:{n:"Phare",p:150,svg:'<svg viewBox="0 0 40 80"><ellipse cx="20" cy="77" rx="16" ry="3.5" fill="rgba(0,0,0,.2)"/><path d="M12 76 15 26h10l3 50Z" fill="#fff"/><path d="M13.3 58h13.4l.6 9H12.7Zm1-18h11.4l.6 9H13.7Z" fill="#E8434F"/><rect x="13" y="18" width="14" height="9" rx="2" fill="#3A3F4A"/><circle class="lit" cx="20" cy="22.5" r="3.6" fill="#FFE27A"/><path d="M11 18 20 8l9 10Z" fill="#E8434F"/></svg>'}
};
var AVATAR='<svg viewBox="0 0 60 70"><ellipse cx="30" cy="66" rx="16" ry="4" fill="rgba(0,0,0,.22)"/><g class="feet"><ellipse class="f1" cx="22" cy="60" rx="6" ry="4" fill="#C2185B"/><ellipse class="f2" cx="38" cy="60" rx="6" ry="4" fill="#C2185B"/></g><circle cx="30" cy="34" r="24" fill="url(#avG)"/><circle cx="30" cy="34" r="24" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2"/><ellipse cx="21" cy="24" rx="6" ry="3.5" transform="rotate(-35 21 24)" fill="#fff" opacity=".85"/><ellipse class="eye" cx="24" cy="36" rx="3" ry="4.2" fill="#2A1020"/><ellipse class="eye" cx="37" cy="36" rx="3" ry="4.2" fill="#2A1020"/><path d="M26 45q4 3 8 0" stroke="#2A1020" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="18" cy="43" r="3" fill="#FF8FB8" opacity=".7"/><circle cx="43" cy="43" r="3" fill="#FF8FB8" opacity=".7"/><defs><radialGradient id="avG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFB3D1"/><stop offset=".6" stop-color="#FF5FA2"/><stop offset="1" stop-color="#E83E7A"/></radialGradient></defs></svg>';
var CHEST='<svg viewBox="0 0 50 44"><ellipse cx="25" cy="41" rx="20" ry="3.5" fill="rgba(0,0,0,.22)"/><rect x="5" y="18" width="40" height="22" rx="4" fill="#B5793F"/><rect x="5" y="18" width="40" height="22" rx="4" fill="none" stroke="#7A5530" stroke-width="2"/><rect x="5" y="26" width="40" height="3" fill="#FFC93C"/><g class="lid"><path d="M5 20v-4a10 10 0 0 1 10-10h20a10 10 0 0 1 10 10v4Z" fill="#C98A4B" stroke="#7A5530" stroke-width="2"/><rect x="21" y="14" width="8" height="10" rx="2" fill="#FFC93C" stroke="#B07A00" stroke-width="1.5"/></g></svg>';
function onLand(x,y,pad){var a=Math.atan2((y-ISC.y)/.92,x-ISC.x),r=Math.hypot(x-ISC.x,(y-ISC.y)/.92);return r<islandR(a)-(pad||0)}
function chestSpot(){var d=today(),seed=0;for(var i=0;i<d.length;i++)seed=(seed*31+d.charCodeAt(i))%2147483647;var rnd=function(){seed=(seed*16807)%2147483647;return seed/2147483647};
 for(var k=0;k<200;k++){var a=rnd()*Math.PI*2,r=120+rnd()*380,x=ISC.x+Math.cos(a)*r,y=ISC.y+Math.sin(a)*r*.92;if(!onLand(x,y,70))continue;var ok=true;DISTRICTS.forEach(function(dd){dd.ids.forEach(function(b){if(Math.hypot(x-b[1],y-b[2])<110)ok=false})});if(ok)return [Math.round(x),Math.round(y)]}return [ISC.x+160,ISC.y+200]}
function decorHTML(p,i){var d=DECOR[p.t];return '<div class="deco d-'+p.t+'" data-deco="'+i+'" style="left:'+p.x+'px;top:'+p.y+'px">'+d.svg+'</div>'}
function islandExtras(){
 var s=isave(),h='<div class="decos">'+s.placed.map(decorHTML).join("")+'</div>';
 if(s.chest.day!==today()){var c=chestSpot();h+='<button class="chest" data-chest="1" style="left:'+c[0]+'px;top:'+c[1]+'px" aria-label="Coffre caché">'+CHEST+'<i class="glint"></i></button>'}
 h+='<div class="avatar2" id="ava" style="left:'+s.pos.x+'px;top:'+s.pos.y+'px">'+AVATAR+'<b>Toi</b></div>';
 return h;
}
function hudHTML(){var s=isave();return '<div class="iright"><button class="coins" data-shop="1" aria-label="Mes pièces">'+COIN+'<b id="coinN">'+s.coins+'</b></button><button class="avatar" data-profile="1" aria-label="Mon profil">'+limaLogo(1)+'</button></div>'}
function setCoins(n,from){var s=isave();s.coins=Math.max(0,n);iput(s);var c=$("#coinN");if(c){c.textContent=s.coins;var b=c.parentNode;b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}}
function coinToast(t){var o=document.querySelector(".ctoast");if(o)o.remove();var d=document.createElement("div");d.className="ctoast";d.innerHTML=COIN+"<span>"+t+"</span>";($("#island")||document.body).appendChild(d);setTimeout(function(){d.remove()},2200)}
/* walking */
var WALK=null;
function walkTo(x,y,done){var a=$("#ava");if(!a)return;var s=isave();if(!onLand(x,y,20)){var an=Math.atan2((y-ISC.y)/.92,x-ISC.x),r=islandR(an)-30;x=ISC.x+Math.cos(an)*r;y=ISC.y+Math.sin(an)*r*.92}
 cancelAnimationFrame(WALK);var x0=parseFloat(a.style.left),y0=parseFloat(a.style.top),dist=Math.hypot(x-x0,y-y0);if(dist<4){done&&done();return}
 var dur=REDUCE?1:Math.max(300,dist/240*1000),t0=performance.now();a.classList.add("walk");a.classList.toggle("left",x<x0);
 var mk=document.createElement("i");mk.className="tapmark";mk.style.left=x+"px";mk.style.top=y+"px";$("#iworld").appendChild(mk);setTimeout(function(){mk.remove()},700);
 (function st(now){var p=Math.min(1,(now-t0)/dur);var cx=x0+(x-x0)*p,cy=y0+(y-y0)*p;a.style.left=cx+"px";a.style.top=cy+"px";if(p<1)WALK=requestAnimationFrame(st);else{a.classList.remove("walk");s.pos={x:Math.round(x),y:Math.round(y)};iput(s);done&&done()}})(t0);
}
function openChest(btn){
 if(btn.classList.contains("open"))return;btn.classList.add("open");var s=isave();s.chest={day:today()};iput(s);
 var reward=40+Math.floor(Math.random()*4)*10;
 for(var i=0;i<10;i++){var c=document.createElement("i");c.className="flycoin";c.innerHTML=COIN;c.style.setProperty("--dx",(Math.random()*160-80).toFixed(0)+"px");c.style.setProperty("--dy",(-60-Math.random()*90).toFixed(0)+"px");c.style.animationDelay=(i*.04)+"s";btn.appendChild(c)}
 setTimeout(function(){setCoins(isave().coins+reward);coinToast("Coffre trouvé ! +"+reward+" pièces");try{bump("chests")}catch(e){}},500);
 setTimeout(function(){btn.classList.add("gone");setTimeout(function(){btn.remove()},500)},1800);
}
/* coins for opening apps (once per app per day) */
document.addEventListener("click",function(e){var p=e.target.closest(".pill[data-track],.pill[data-game]");if(!p)return;var id=p.dataset.track||p.dataset.game;if(p.dataset.game)try{trackOpen(id)}catch(err){}
 var s=isave(),k=id+"|"+today();if(s.paid[k])return;s.paid[k]=1;var keys=Object.keys(s.paid);if(keys.length>80)keys.slice(0,keys.length-80).forEach(function(x){delete s.paid[x]});s.coins+=10;iput(s);var c=$("#coinN");if(c)c.textContent=s.coins;if(stab==="island")coinToast("+10 pièces pour "+item(id).name.replace(" Tycoon",""))},true);
/* build mode */
var BUILD=null;
function openShop(){var s=isave(),el=$("#ishop");if(!el)return;$("#island").classList.add("building");$("#icard").classList.remove("show");
 el.innerHTML='<div class="shh2"><b>Construire</b><span>'+COIN+'<em id="coinN2">'+s.coins+'</em></span><button class="pill solid sm" data-shopdone="1">Terminé</button></div><div class="shopr">'+Object.keys(DECOR).map(function(k){var d=DECOR[k];return '<button class="sitem'+(BUILD===k?" on":"")+(s.coins<d.p?" poor":"")+'" data-item="'+k+'"><span>'+d.svg+'</span><b>'+d.n+'</b><small>'+COIN+d.p+'</small></button>'}).join("")+'</div><p class="shint">'+(BUILD?"Touche l'île pour poser : "+DECOR[BUILD].n+(DECOR[BUILD].water?" (aussi sur l'eau près de la plage)":""):"Choisis un objet. Touche un objet déjà posé pour le retirer (moitié remboursée).")+'</p>';el.classList.add("show")}
function closeShop(){BUILD=null;var el=$("#ishop");if(el)el.classList.remove("show");var i=$("#island");if(i)i.classList.remove("building")}
function placeAt(x,y){var d=DECOR[BUILD],s=isave();if(!d)return;if(s.coins<d.p){coinToast("Pas assez de pièces");return}
 var ok=d.water?(Math.hypot(x-ISC.x,(y-ISC.y)/.92)<islandR(Math.atan2((y-ISC.y)/.92,x-ISC.x))+70):onLand(x,y,10);if(!ok){coinToast("Pose-le sur l'île");return}
 var p={t:BUILD,x:Math.round(x),y:Math.round(y)};s.placed.push(p);s.coins-=d.p;iput(s);$(".decos").insertAdjacentHTML("beforeend",decorHTML(p,s.placed.length-1));var n=$(".decos").lastChild;n.classList.add("pop");
 setCoins(s.coins);openShop()}
function removeDeco(i){var s=isave(),p=s.placed[i];if(!p)return;s.placed.splice(i,1);s.coins+=Math.floor(DECOR[p.t].p/2);iput(s);$(".decos").innerHTML=s.placed.map(decorHTML).join("");setCoins(s.coins);openShop()}
/* weather (open-meteo, only after the user taps "Météo") */
var WX={0:["Soleil","sun"],1:["Beau temps","sun"],2:["Nuageux","cloud"],3:["Couvert","cloud"],45:["Brouillard","fog"],48:["Brouillard","fog"],51:["Bruine","rain"],53:["Bruine","rain"],55:["Bruine","rain"],56:["Pluie verglaçante","rain"],57:["Pluie verglaçante","rain"],61:["Pluie","rain"],63:["Pluie","rain"],65:["Grosse pluie","rain"],66:["Pluie glacée","rain"],67:["Pluie glacée","rain"],71:["Neige","snow"],73:["Neige","snow"],75:["Grosse neige","snow"],77:["Neige","snow"],80:["Averses","rain"],81:["Averses","rain"],82:["Grosses averses","rain"],85:["Averses de neige","snow"],86:["Averses de neige","snow"],95:["Orage","storm"],96:["Orage","storm"],99:["Orage","storm"]};
function applyWeather(code,temp){var el=$("#island");if(!el)return;var w=WX[code]||["",""];["sun","cloud","fog","rain","snow","storm"].forEach(function(k){el.classList.remove("wx-"+k)});if(w[1])el.classList.add("wx-"+w[1]);var c=$("#wxchip");if(c)c.innerHTML=(typeof temp==="number"?Math.round(temp)+"° · ":"")+w[0]}
function loadWeather(ask){
 var cache=store.get("pop.wx");if(cache&&Date.now()-cache.t<30*60e3){applyWeather(cache.c,cache.temp);return}
 var loc=store.get("pop.loc");
 function fetchWx(lat,lon){fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat.toFixed(2)+"&longitude="+lon.toFixed(2)+"&current=weather_code,temperature_2m").then(function(r){return r.json()}).then(function(j){var c=j.current.weather_code,t=j.current.temperature_2m;store.set("pop.wx",{t:Date.now(),c:c,temp:t});applyWeather(c,t)}).catch(function(){var ch=$("#wxchip");if(ch)ch.textContent="Météo indisponible"})}
 if(loc){fetchWx(loc.lat,loc.lon);return}
 if(!ask)return;
 if(!navigator.geolocation){$("#wxchip").textContent="Météo indisponible";return}
 $("#wxchip").textContent="Localisation…";
 navigator.geolocation.getCurrentPosition(function(p){var l={lat:p.coords.latitude,lon:p.coords.longitude};store.set("pop.loc",l);fetchWx(l.lat,l.lon)},function(){$("#wxchip").textContent="Météo refusée"},{maximumAge:36e5,timeout:12000});
}
window.__popWeather=applyWeather;
document.addEventListener("click",function(e){
 if(!IS||stab!=="island")return;var t=e.target;
 if(IS.dragged&&performance.now()-IS.dragged<250&&t.closest("#island")&&!t.closest(".icard,.itop,.irecenter,.ishop,.ibuild"))return;
 if(t.closest("[data-shop]")){openShop();return}
 if(t.closest(".ibuild")){openShop();return}
 if(t.closest("[data-shopdone]")){closeShop();return}
 var it=t.closest("[data-item]");if(it){BUILD=BUILD===it.dataset.item?null:it.dataset.item;openShop();return}
 if(t.closest("#wxchip")){loadWeather(true);return}
 var ch=t.closest("[data-chest]");if(ch){var x=parseFloat(ch.style.left),y=parseFloat(ch.style.top);walkTo(x-30,y+10,function(){openChest(ch)});return}
 var dc=t.closest("[data-deco]");if(dc&&BUILD===null&&$("#island").classList.contains("building")){removeDeco(+dc.dataset.deco);return}
 if(t.closest(".bld,.boat,.fountain,.icard,.itop,.irecenter,.ishop,a,button"))return;
 if(!t.closest("#iworld")&&!t.closest("#island"))return;
 var el=$("#island"),r=el.getBoundingClientRect(),wx=(e.clientX-r.left-IS.cam.x)/IS.cam.s,wy=(e.clientY-r.top-IS.cam.y)/IS.cam.s;
 if(BUILD){placeAt(wx,wy);return}
 walkTo(wx,wy);
});
