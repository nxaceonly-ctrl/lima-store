
/* ---------- ISLAND (Pop world you explore with your finger) ---------- */
var WORLD=1400,ISC={x:700,y:720};
var DISTRICTS=[
 {k:"arcade",name:"Quartier Arcade",at:[930,300],col:"#7C5CFF",ids:[["breche",905,440],["qg",1050,560],["nocta",770,330],["frequence",1090,730],["champion",950,640]]},
 {k:"tycoon",name:"Quartier Tycoon",at:[960,1180],col:"#E8A33D",ids:[["bastion",880,960],["mafia",1040,880],["studio",800,1090]]},
 {k:"vie",name:"Quartier Vie",at:[380,420],col:"#2FBF71",ids:[["ascendant",440,560],["ciel",580,420],["azimut",380,770],["velours",530,920]]},
 {k:"son",name:"Studio son",at:[1180,430],col:"#FF4D8D",ids:[["volta",1160,560]]}
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
  d.ids.forEach(function(b){var it=item(b[0]);h+='<button class="bld" data-bld="'+b[0]+'" style="left:'+b[1]+'px;top:'+b[2]+'px;--c:'+d.col+';--dl:'+(Math.random()*2).toFixed(2)+'s"><span class="sh"></span><span class="plinth"></span><span class="tile">'+icn(b[0])+'</span><b>'+esc(it.name.replace(" Tycoon",""))+'</b></button>'});
 });
 var mine=myApps(),spots=[[170,260],[1250,1230],[150,1080],[1290,250],[700,90],[640,1330],[90,640],[1330,820]];
 mine.slice(0,8).forEach(function(a,i){var p=spots[i];h+='<a class="boat" href="'+esc(a.u)+'"'+(/^https?:/i.test(a.u)?' target="_blank" rel="noopener"':"")+' style="left:'+p[0]+'px;top:'+p[1]+'px;--dl:'+(i*.7)+'s"><span class="hull"></span><span class="sail">'+letterIcon(a)+'</span><b>'+esc(a.n)+'</b></a>'});
 if(mine.length<8){var p=spots[mine.length];h+='<button class="boat add" data-add="1" style="left:'+p[0]+'px;top:'+p[1]+'px"><span class="hull"></span><span class="sail"><span class="letter" style="background:rgba(255,255,255,.85);color:#FF4D6D">+</span></span><b>Ajouter</b></button>'}
 h+='<div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div></div>';
 h+='<div class="itop"><div class="ibrand"><span class="ilogo">'+limaLogo(1)+'</span><div><b>Île de Pop</b><small>'+(night?"Bonne nuit":"Glisse pour explorer")+'</small></div></div><button class="avatar" data-profile="1" aria-label="Mon profil">'+limaLogo(1)+'</button></div>';
 h+='<button class="irecenter" data-recenter="1" aria-label="Revenir au centre"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button>';
 h+='<div class="icard" id="icard"></div></div>';
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
 var el=$("#island");if(!el)return;IS=isl();
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
}
document.addEventListener("click",function(e){
 if(!IS||stab!=="island")return;
 if(IS.dragged&&performance.now()-IS.dragged<250&&e.target.closest("#island")){if(!e.target.closest(".icard,.itop,.irecenter")){e.stopPropagation();e.preventDefault();return}}
 var b=e.target.closest("[data-bld]");if(b){selectBld(b.dataset.bld);return}
 if(e.target.closest("[data-icx]")){$("#icard").classList.remove("show");document.querySelectorAll(".bld.on").forEach(function(x){x.classList.remove("on")});return}
 if(e.target.closest("[data-recenter]")){focusOn(ISC.x,ISC.y+40,Math.max(.62,Math.min(.9,$("#island").clientWidth/560)),800);return}
 if(e.target.closest(".fountain")){var w=$("#island");w.classList.remove("burst");void w.offsetWidth;w.classList.add("burst");return}
},true);
