/* ---------- HELPERS ---------- */
var SUF=["","k","M","Md","Bn","Bd","Tn","Td","Qn","Qd"];
function fmt(n){
 if(!isFinite(n))return "∞";var neg=n<0;n=Math.abs(n);var r;
 if(n<1000)r=n<10&&n%1?n.toFixed(1).replace(".",","):Math.floor(n).toLocaleString("fr-FR");
 else{var e=Math.min(SUF.length-1,Math.floor(Math.log10(n)/3)),v=n/Math.pow(1000,e);r=(e===SUF.length-1&&v>=1000)?n.toExponential(2).replace(".",","):(v<100?v.toFixed(2):v.toFixed(1)).replace(".",",")+" "+SUF[e]}
 return (neg?"−":"")+r;
}
function fmtTime(s){s=Math.max(0,Math.ceil(s));var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?h+" h "+(m<10?"0":"")+m:m?m+" min "+(x<10?"0":"")+x:x+" s"}
function fmtDur(min){return min>=60?(min/60)+" h":min+" min"}
function rand(a,b){return a+Math.random()*(b-a)}
function ri(a,b){return Math.floor(rand(a,b+1))}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function gl(d){return '<svg class="glyph" viewBox="0 0 24 24"><path d="'+d+'"/></svg>'}
function rankBar(list,score,thr){ // thr: ascending thresholds same length as list
 var i=0;while(i<list.length-1&&score>=thr[i+1])i++;
 var p=i===list.length-1?1:clamp((score-thr[i])/(thr[i+1]-thr[i]),0,1);
 return {name:list[i],next:list[i+1],p:p,i:i};
}

/* =========================================================
   BASTION : base sur une carte + missions chronométrées
   ========================================================= */
var COLS=5;
var BT={
 atelier:{n:"Atelier",cost:25,prod:1,g:"M14 7l3-3 3 3-3 3M4 20l9-9M15 13l5 5-2 2-5-5",d:"Produit du budget."},
 tente:{n:"Tentes",cost:60,cap:5,g:"M3 20 12 4l9 16zM12 4v16",d:"Loge 5 soldats par niveau."},
 mess:{n:"Mess",cost:400,boost:.3,g:"M5 3v8a3 3 0 0 0 6 0V3M8 11v10M17 3c-2 2-2 7 0 9v9",d:"+30 % par niveau aux bâtiments qui produisent, juste à côté (haut, bas, gauche, droite)."},
 depot:{n:"Dépôt de carburant",cost:900,prod:12,g:"M6 21V8l6-5 6 5v13M6 13h12M10 21v-4h4v4",d:"Produit beaucoup plus de budget."},
 stand:{n:"Stand de tir",cost:2000,chance:.04,g:"M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",d:"+4 % de réussite des missions par niveau."},
 caserne:{n:"Caserne",cost:5000,cap:18,g:"M3 21V9l9-5 9 5v12M8 21v-6h8v6M3 12h18",d:"Loge 18 soldats par niveau."},
 qg:{n:"Poste de commandement",cost:15000,unique:1,all:.15,g:"M12 3v6M12 3l6 2-6 2M5 21l7-12 7 12z",d:"Unique. +15 % de toute la production par niveau."},
 usine:{n:"Usine d'armement",cost:40000,prod:200,g:"M3 21V11l5 3V11l5 3V7h4l1 14z",d:"Grosse production."},
 hangar:{n:"Hangar à blindés",cost:150000,unique:1,unlock:1,g:"M3 15h18v4H3zM6 15l2-6h8l2 6M7 19v1M17 19v1",d:"Unique. Débloque les missions blindées (plus longues, plus payées)."},
 logis:{n:"Centre logistique",cost:1.2e6,prod:3200,g:"M3 7h13v10H3zM16 10h4l1 3v4h-5M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4",d:"Production énorme."},
 piste:{n:"Piste aérienne",cost:8e6,unique:1,unlock:2,g:"M2 14l8-2 2-8 2 8 8 2-8 2-2 6-2-6z",d:"Unique. Débloque les missions aériennes."}
};
var BT_ORDER=Object.keys(BT);
var B_ROWS=[400,9000,180000,4e6,9e7];
var B_RANKS=["Recrue","Soldat","Caporal","Sergent","Adjudant","Lieutenant","Capitaine","Commandant","Colonel","Général","Général d'armée"];
var B_THR=[0,8,25,60,130,260,500,900,1600,3000,6000];
var B_MIS=[["Patrouille de nuit","Garde d'un pont","Reconnaissance en forêt","Escorte de ravitaillement","Exercice de tir","Sauvetage en montagne","Tenir un carrefour"],["Convoi blindé","Raid motorisé","Ouvrir une route","Ravitailler le front"],["Héliportage","Pont aérien","Largage de matériel","Évacuation d'urgence"]];
var B_TIERN=["À pied","Blindés","Aérien"];
function bUpCost(t,lv){return BT[t].cost*Math.pow(2.4,lv)}
function bAdj(i){var r=[],x=i%COLS;if(x>0)r.push(i-1);if(x<COLS-1)r.push(i+1);r.push(i-COLS,i+COLS);return r}
function bLv(S,t){var m=0;S.tiles.forEach(function(x){if(x&&x.t===t)m=Math.max(m,x.lv)});return m}
function bTileProd(S,i){
 var x=S.tiles[i];if(!x||!BT[x.t].prod)return 0;
 var b=1;bAdj(i).forEach(function(j){var y=S.tiles[j];if(y&&y.t==="mess")b+=BT.mess.boost*y.lv});
 return BT[x.t].prod*x.lv*Math.pow(1.35,x.lv-1)*b*(1+bLv(S,"qg")*BT.qg.all);
}
function bProd(S){var t=0;for(var i=0;i<S.tiles.length;i++)t+=bTileProd(S,i);return t}
function bCap(S){var c=3;S.tiles.forEach(function(x){if(x&&BT[x.t].cap)c+=BT[x.t].cap*x.lv});return c}
function bBusy(S){return S.mis.reduce(function(a,m){return a+(m.end?m.need:0)},0)}
function bChance(S,tier){var c=.6-tier*.05;S.tiles.forEach(function(x){if(x&&x.t==="stand")c+=BT.stand.chance*x.lv});return clamp(c,.1,.97)}
function bTier(S){return bLv(S,"piste")?2:bLv(S,"hangar")?1:0}
function bOffer(S){
 var mt=bTier(S),tier=Math.random()<.6?mt:ri(0,mt);
 var durs=[[1,3,5,10,20,30],[10,20,30,60,90],[30,60,90,120,180]][tier],dur=pick(durs);
 var cap=bCap(S),need=Math.max(2,Math.min(Math.round(cap*rand(.25,.7)),Math.ceil((2+dur*.35)*(1+tier))));
 var p=Math.max(1,bProd(S));
 return {nm:pick(B_MIS[tier]),tier:tier,dur:dur,need:need,rew:Math.round(p*dur*60*(.55+tier*.35)+40*dur*(1+tier)),xp:Math.ceil((1+dur/6)*(1+tier)),end:0};
}
var Bastion={
 id:"bastion",name:"Bastion",full:"Bastion Tycoon",cls:"th-bastion",unit:"€",tag:"Construis ta base, envoie tes troupes",
 tabs:[["base","Base"],["mis","Missions"]],
 fresh:function(){var t=new Array(COLS*8).fill(null);t[6]={t:"atelier",lv:1};t[8]={t:"tente",lv:1};var S={cash:120,xp:0,rows:3,tiles:t,sol:3,mis:[]};for(var i=0;i<3;i++)S.mis.push(bOffer(S));return S},
 step:function(S,dt){S.cash+=bProd(S)*dt;var cap=bCap(S),busy=bBusy(S);if(S.sol+busy<cap)S.sol=Math.min(cap-busy,S.sol+(.12+cap*.004)*dt)},
 top:function(S){var cap=bCap(S);return '<div class="chip"><em>Budget</em><b>'+fmt(S.cash)+' €</b><small>+'+fmt(bProd(S))+' €/s</small></div><div class="chip"><em>Soldats dispo</em><b>'+Math.floor(S.sol)+'</b><small>'+bBusy(S)+' en mission · max '+cap+'</small></div>'},
 rank:function(S){return rankBar(B_RANKS,S.xp,B_THR)},
 badge:function(S,t){if(t==="mis"){var n=S.mis.filter(function(m){return m.end&&m.end<=Date.now()}).length;return n||""}return ""},
 sig:function(S,tab){
  if(tab==="base")return S.rows+"|"+S.tiles.map(function(x){return x?x.t+x.lv+(S.cash>=bUpCost(x.t,x.lv)?"u":""):"-"}).join(",")+"|"+(S.cash>=(B_ROWS[S.rows-3]||Infinity));
  return S.mis.map(function(m){return m.end?(m.end<=Date.now()?"d":"r"):(S.sol>=m.need?"y":"n")}).join("")+bTier(S);
 },
 body:function(S,tab){
  if(tab==="base"){
   var h='<p class="hint">Touche une case vide pour construire. Mets un <b>Mess</b> à côté de tes ateliers et dépôts pour qu\'ils produisent plus.</p><div class="map">';
   for(var i=0;i<COLS*8;i++){
    var row=Math.floor(i/COLS),x=S.tiles[i];
    if(row>=S.rows){h+='<div class="tile lock"></div>';continue}
    if(!x){h+='<button class="tile empty" data-a="build" data-v="'+i+'" aria-label="Construire">+</button>';continue}
    var boosted=BT[x.t].prod&&bAdj(i).some(function(j){var y=S.tiles[j];return y&&y.t==="mess"});
    h+='<button class="tile b'+(boosted?" boosted":"")+'" data-a="tile" data-v="'+i+'"><em>'+x.lv+'</em>'+gl(BT[x.t].g)+'<span>'+BT[x.t].n.split(" ")[0]+'</span>'+(S.cash>=bUpCost(x.t,x.lv)&&x.lv<10?'<i class="up">↑</i>':"")+'</button>';
   }
   h+='</div>';
   if(S.rows<8){var c=B_ROWS[S.rows-3];h+='<div class="btns"><button class="btn ghost wide" data-a="land" '+(S.cash<c?"disabled":"")+'>Agrandir le terrain (+5 cases) · '+fmt(c)+' €</button></div>'}
   return h;
  }
  var t=bTier(S),h2='<p class="hint">Envoie tes soldats en mission. Ils reviennent avec du budget et de l\'expérience pour monter en grade. Réussite : '+Math.round(bChance(S,0)*100)+' % à pied'+(t?" · débloqué : "+B_TIERN.slice(1,t+1).join(", "):" · construis un Hangar pour les blindés")+'.</p><div class="stack">';
  S.mis.forEach(function(m,k){
   var now=Date.now(),done=m.end&&m.end<=now,run=m.end&&!done;
   h2+='<div class="card"><div class="row2"><div><h6>'+m.nm+' <span class="tag'+(m.tier?" acc":"")+'">'+B_TIERN[m.tier]+'</span></h6><div class="meta">'+fmtDur(m.dur)+' · '+m.need+' soldats · '+Math.round(bChance(S,m.tier)*100)+' % de réussite<br>Gain : '+fmt(m.rew)+' € · +'+m.xp+' XP</div></div>'
    +(done?'<button class="btn acc" data-a="collect" data-v="'+k+'">Récupérer</button>':run?'<span class="btn ghost" data-cd="'+m.end+'">…</span>':'<button class="btn" data-a="send" data-v="'+k+'" '+(S.sol<m.need?"disabled":"")+'>Envoyer</button>')+'</div>'
    +(run?'<div class="pbar"><i data-pg="'+(m.end-m.dur*60000)+'|'+m.end+'"></i></div>':"")
    +(!m.end?'<div class="btns" style="margin-top:6px"><button class="btn ghost" style="font-size:11px;padding:6px" data-a="swap" data-v="'+k+'">Autre mission</button></div>':"")+'</div>';
  });
  return h2+'</div>';
 },
 act:function(S,a,v){
  var raw=v;v=+v;
  if(a==="build"){
   return {sheet:'<h5>Construire</h5><p>Case '+(v+1)+'. Choisis un bâtiment.</p><div class="stack">'+BT_ORDER.map(function(t){var b=BT[t],has=b.unique&&bLv(S,t);if(has)return "";return '<button class="opt" data-a="place" data-v="'+v+':'+t+'" '+(S.cash<b.cost?"disabled":"")+'><span class="ico">'+gl(b.g)+'</span><div><b>'+b.n+'</b><small>'+b.d+'</small></div><span class="px">'+fmt(b.cost)+' €</span></button>'}).join("")+'</div>'};
  }
  if(a==="place"){var p=String(raw).split(":"),i=+p[0],t=p[1];if(S.cash<BT[t].cost||S.tiles[i])return;S.cash-=BT[t].cost;S.tiles[i]={t:t,lv:1};return {close:1,toast:BT[t].n+" construit"}}
  if(a==="tile"){
   var x=S.tiles[v],b=BT[x.t],c=bUpCost(x.t,x.lv),info=b.prod?"Produit "+fmt(bTileProd(S,v))+" €/s":b.cap?"Loge "+b.cap*x.lv+" soldats":b.boost?"+"+Math.round(b.boost*x.lv*100)+" % aux voisins":b.chance?"+"+Math.round(b.chance*x.lv*100)+" % de réussite":b.all?"+"+Math.round(b.all*x.lv*100)+" % de production":"Débloque des missions";
   return {sheet:'<h5>'+b.n+' · niv. '+x.lv+'</h5><p>'+b.d+'<br><b style="color:var(--g-fg)">'+info+'</b></p><div class="btns">'+(x.lv<10?'<button class="btn acc" data-a="upg" data-v="'+v+'" '+(S.cash<c?"disabled":"")+'>Améliorer<small>'+fmt(c)+' €</small></button>':'<span class="btn ghost">Niveau max</span>')+'<button class="btn ghost" data-a="demo" data-v="'+v+'">Démolir<small>+'+fmt(b.cost*.5)+' €</small></button></div>'};
  }
  if(a==="upg"){var y=S.tiles[v],cc=bUpCost(y.t,y.lv);if(S.cash<cc)return;S.cash-=cc;y.lv++;return {reopen:["tile",v],toast:BT[y.t].n+" niveau "+y.lv}}
  if(a==="demo"){var z=S.tiles[v];S.cash+=BT[z.t].cost*.5;S.tiles[v]=null;return {close:1,toast:"Démoli"}}
  if(a==="land"){var lc=B_ROWS[S.rows-3];if(S.cash<lc)return;S.cash-=lc;S.rows++;return {toast:"Terrain agrandi"}}
  if(a==="send"){var m=S.mis[v];if(S.sol<m.need)return;S.sol-=m.need;m.end=Date.now()+m.dur*60000;return {toast:m.nm+" : en route"}}
  if(a==="swap"){S.mis[v]=bOffer(S);return {}}
  if(a==="collect"){
   var mm=S.mis[v],ok=Math.random()<bChance(S,mm.tier);S.sol+=mm.need;
   if(ok){S.cash+=mm.rew;S.xp+=mm.xp}else{S.cash+=Math.round(mm.rew*.2);S.xp+=1}
   S.mis[v]=bOffer(S);
   return {modal:[ok?"Mission réussie":"Mission ratée",ok?"+"+fmt(mm.rew)+" €":"+"+fmt(Math.round(mm.rew*.2))+" €",ok?mm.nm+" : tout le monde rentre. +"+mm.xp+" XP.":mm.nm+" : l'objectif n'est pas atteint, mais tes soldats sont rentrés."]};
  }
 },
 summary:function(S){return this.rank(S).name+" · "+fmt(S.cash)+" € · "+S.tiles.filter(Boolean).length+" bâtiments"}
};

/* =========================================================
   MAFIA : quartiers, chaleur, coups
   ========================================================= */
var M_D=[["Les Hauteurs",5,1],["Le Théâtre",3,1],["Quartier des banques",10,2],["La Gare",2,0],["Vieux Quartier",1,-1],["Le Marché",2,0],["Les Docks",3,0],["Front de mer",6,2],["Hôtel de ville",16,2]];
var M_FAM=[["Famille Moretti","#3B2A3F"],["Les Bastiani","#24343A"],["Clan Varga","#3E2A1E"]];
var M_BIZ={
 bar:{n:"Bar clandestin",cost:150,inc:4,heat:.025,g:"M6 3h12l-6 9zM12 12v8M8 21h8",d:"Rapporte, attire un peu la police."},
 laverie:{n:"Blanchisserie",cost:900,inc:2,heat:-.05,g:"M5 3h14v18H5zM12 13m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0",d:"Fait baisser la chaleur."},
 tripot:{n:"Tripot",cost:2800,inc:38,heat:.06,g:"M4 4h16v16H4zM9 9h.01M15 15h.01M15 9h.01M9 15h.01",d:"Jeux de cartes. Rapporte bien."},
 club:{n:"Club de jazz",cost:70000,inc:650,heat:.09,g:"M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0",d:"La grande classe. Très rentable."},
 casino:{n:"Casino",cost:3e6,inc:21000,heat:.16,g:"M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 3v4M12 17v4M3 12h4M17 12h4",d:"Le jackpot. Attire beaucoup la police."}
};
var M_RANKS=["Petite main","Associé","Soldat","Capo","Lieutenant","Consigliere","Sous-boss","Boss","Parrain"];
var M_COUPS=["Braquage d'un fourgon","Cargaison aux docks","Partie de poker truquée","Vol de tableaux","Contrebande de whisky","Faux billets","Course de chevaux arrangée","Chantage d'un notable"];
function mCity(S){return 1+S.city*.8}
function mDef(S,i){return Math.round(6*Math.pow(M_D[i][1],1.45)*Math.pow(1.7,S.city))}
function mBuy(S,i){return mDef(S,i)*M_D[i][1]*180*Math.pow(2,S.city)}
function mBizCost(S,i,t){return M_BIZ[t].cost*Math.pow(M_D[i][1],1.1)*Math.pow(3,S.city)}
function mNear(S,i){var x=i%3,y=Math.floor(i/3);return S.own.some(function(o,j){if(!o)return false;var a=j%3,b=Math.floor(j/3);return Math.abs(a-x)+Math.abs(b-y)===1})}
function mInc(S){var t=0;S.own.forEach(function(o,i){if(!o)return;var v=M_D[i][1];t+=2*v;S.biz[i].forEach(function(b){t+=M_BIZ[b].inc*v})});return t*mCity(S)}
function mHeatRate(S){var h=-.035;S.own.forEach(function(o,i){if(!o)return;S.biz[i].forEach(function(b){h+=M_BIZ[b].heat})});return h}
function mRecruit(S,n){var c=0;for(var k=0;k<n;k++)c+=35*Math.pow(1.045,S.hired+k)*Math.pow(2,S.city);return c}
function mBusy(S){return S.coups.reduce(function(a,c){return a+(c.end?c.need:0)},0)}
function mOffer(S){var inc=Math.max(3,mInc(S)),dur=pick([2,5,10,15,30,45]),need=Math.max(2,Math.round((2+dur*.4)*Math.pow(1.4,S.city)));return {nm:pick(M_COUPS),dur:dur,need:need,rew:Math.round(inc*dur*60*.9+60*dur),end:0,mode:0}}
function mLawyer(S){return Math.max(80,mInc(S)*50)}
var Mafia={
 id:"mafia",name:"Mafia Tycoon",full:"Mafia Tycoon",cls:"th-mafia",unit:"$",tag:"Prends la ville quartier par quartier",
 tabs:[["ville","La ville"],["coups","Coups"]],
 fresh:function(){var S={cash:300,men:4,hired:0,heat:0,city:0,own:[0,0,0,0,1,0,0,0,0],biz:[[],[],[],[],["bar"],[],[],[],[]],coups:[],raids:0};S.coups=[mOffer(S),mOffer(S)];return S},
 step:function(S,dt){
  S.cash+=mInc(S)*dt;S.heat=clamp(S.heat+mHeatRate(S)*dt,0,100);
  if(S.heat>=100){var lost=Math.round(S.cash*.3);S.cash-=lost;var mine=[];S.own.forEach(function(o,i){if(o&&S.biz[i].length)mine.push(i)});var gone="";if(mine.length){var d=pick(mine),k=ri(0,S.biz[d].length-1);gone=M_BIZ[S.biz[d][k]].n+" ("+M_D[d][0]+")";S.biz[d].splice(k,1)}S.heat=35;S.raids++;S._raid=[lost,gone]}
 },
 top:function(S){return '<div class="chip"><em>La caisse</em><b>'+fmt(S.cash)+' $</b><small>+'+fmt(mInc(S))+' $/s</small></div><div class="chip"><em>Hommes</em><b>'+Math.floor(S.men)+'</b><small>'+mBusy(S)+' sur un coup</small></div><div class="chip'+(S.heat>70?" hot":"")+'"><em>Police</em><b>'+Math.floor(S.heat)+' %</b><small>'+(mHeatRate(S)>0?"monte":"redescend")+'</small></div>'},
 rank:function(S){var n=S.own.filter(Boolean).length,r=rankBar(M_RANKS,n,[1,2,3,4,5,6,7,8,9]);if(S.city)r.name+=" · ville "+(S.city+1);return r},
 badge:function(S,t){if(t==="coups"){var n=S.coups.filter(function(c){return c.end&&c.end<=Date.now()}).length;return n||""}return ""},
 sig:function(S,tab){
  if(tab==="ville")return S.own.join("")+S.biz.map(function(b){return b.join("")}).join("|")+"|"+(S.cash>=mLawyer(S))+(S.cash>=mRecruit(S,1))+(S.cash>=mRecruit(S,5))+"|"+S.city+"|"+S.own.map(function(o,i){return !o&&(S.men>=mDef(S,i)||S.cash>=mBuy(S,i))?1:0}).join("");
  return S.coups.map(function(c){return c.end?(c.end<=Date.now()?"d":"r"):(S.men>=c.need?"y":"n")}).join("");
 },
 body:function(S,tab){
  if(tab==="ville"){
   var heatR=mHeatRate(S),h='<div class="card"><div class="row2"><div><h6>Chaleur de la police</h6><div class="meta">'+(S.heat>70?"Attention : à 100 %, descente de police (tu perds 30 % de la caisse et une affaire).":"À 100 %, descente de police. Les blanchisseries la font baisser.")+'</div></div><button class="btn" data-a="lawyer" '+(S.cash<mLawyer(S)?"disabled":"")+'>Avocat −30 %<small>'+fmt(mLawyer(S))+' $</small></button></div><div class="bar heat"><i style="width:'+S.heat.toFixed(0)+'%"></i></div></div>'
    +'<div class="btns" style="margin-bottom:12px"><button class="btn ghost" data-a="rec" data-v="1" '+(S.cash<mRecruit(S,1)?"disabled":"")+'>+1 homme<small>'+fmt(mRecruit(S,1))+' $</small></button><button class="btn ghost" data-a="rec" data-v="5" '+(S.cash<mRecruit(S,5)?"disabled":"")+'>+5 hommes<small>'+fmt(mRecruit(S,5))+' $</small></button></div>'
    +'<p class="hint">Touche un quartier. Tu ne peux attaquer que les quartiers <b>collés aux tiens</b>.</p><div class="city">';
   M_D.forEach(function(d,i){
    var o=S.own[i];
    if(o){h+='<button class="dist me" data-a="dist" data-v="'+i+'"><b>'+d[0]+'</b><small>À toi · +'+fmt((2+S.biz[i].reduce(function(a,b){return a+M_BIZ[b].inc},0))*d[1]*mCity(S))+' $/s</small><span class="slots">'+[0,1,2].map(function(k){return '<i class="'+(S.biz[i][k]?"on":"")+'"></i>'}).join("")+'</span></button>'}
    else{var f=M_FAM[d[2]<0?0:d[2]],near=mNear(S,i);h+='<button class="dist '+(near?"near":"far")+'" style="--c:'+f[1]+'" data-a="dist" data-v="'+i+'"><b>'+d[0]+'</b><small>'+f[0]+'<br>'+mDef(S,i)+' hommes</small><span></span></button>'}
   });
   h+='</div>';
   if(S.own.every(Boolean))h+='<div class="card" style="margin-top:12px"><h6>Toute la ville est à toi.</h6><div class="meta">Pars conquérir une ville plus grande : tout repart à zéro, mais chaque ville rapporte bien plus (+80 % par ville).</div><div class="btns"><button class="btn acc" data-a="newcity">Nouvelle ville</button></div></div>';
   return h;
  }
  var h2='<p class="hint">Un coup immobilise tes hommes pendant un moment. <b>Discret</b> : sûr, peu de police. <b>Audacieux</b> : rapporte ×2,5 mais risqué.</p><div class="stack">';
  S.coups.forEach(function(c,k){
   var done=c.end&&c.end<=Date.now(),run=c.end&&!done;
   h2+='<div class="card"><h6>'+c.nm+'</h6><div class="meta">'+fmtDur(c.dur)+' · '+c.need+' hommes · gain '+fmt(c.rew)+' $ (discret) / '+fmt(c.rew*2.5)+' $ (audacieux)</div>'
    +(done?'<div class="btns"><button class="btn acc" data-a="cres" data-v="'+k+'">Voir le résultat</button></div>':run?'<div class="meta" style="margin-top:8px">En cours ('+(c.mode?"audacieux":"discret")+') · <span data-cd="'+c.end+'"></span></div><div class="pbar"><i data-pg="'+(c.end-c.dur*60000)+'|'+c.end+'"></i></div>'
    :'<div class="btns"><button class="btn" data-a="coup" data-v="'+k+':0" '+(S.men<c.need?"disabled":"")+'>Discret<small>85 % · police +5</small></button><button class="btn acc" data-a="coup" data-v="'+k+':1" '+(S.men<c.need?"disabled":"")+'>Audacieux<small>60 % · police +18</small></button></div>')+'</div>';
  });
  return h2+'</div>';
 },
 act:function(S,a,v){
  if(a==="lawyer"){var c=mLawyer(S);if(S.cash<c)return;S.cash-=c;S.heat=Math.max(0,S.heat-30);return {toast:"L'avocat a calmé la police"}}
  if(a==="rec"){var n=+v,cr=mRecruit(S,n);if(S.cash<cr)return;S.cash-=cr;S.men+=n;S.hired+=n;return {toast:"+"+n+" homme"+(n>1?"s":"")}}
  if(a==="dist"){
   var i=+v,d=M_D[i];
   if(S.own[i]){
    return {sheet:'<h5>'+d[0]+'</h5><p>Ton quartier. Protection : +'+fmt(2*d[1]*mCity(S))+' $/s. Trois emplacements pour tes affaires.</p><div class="stack">'+[0,1,2].map(function(k){var b=S.biz[i][k];if(b)return '<div class="opt"><span class="ico">'+gl(M_BIZ[b].g)+'</span><div><b>'+M_BIZ[b].n+'</b><small>+'+fmt(M_BIZ[b].inc*d[1]*mCity(S))+' $/s · police '+(M_BIZ[b].heat>0?"+":"")+M_BIZ[b].heat+'/s</small></div><button class="btn ghost" data-a="sell" data-v="'+i+':'+k+'">Fermer</button></div>';
      return '<div class="lbl">Emplacement libre</div>'+Object.keys(M_BIZ).map(function(t){var cc=mBizCost(S,i,t);return '<button class="opt" data-a="open" data-v="'+i+':'+t+'" '+(S.cash<cc?"disabled":"")+'><span class="ico">'+gl(M_BIZ[t].g)+'</span><div><b>'+M_BIZ[t].n+'</b><small>'+M_BIZ[t].d+' +'+fmt(M_BIZ[t].inc*d[1]*mCity(S))+' $/s</small></div><span class="px">'+fmt(cc)+' $</span></button>'}).join("")}).join("")+'</div>'};
   }
   var near=mNear(S,i),def=mDef(S,i),buy=mBuy(S,i),f=M_FAM[d[2]];
   return {sheet:'<h5>'+d[0]+'</h5><p>Tenu par '+f[0]+'. Défendu par '+def+' hommes. Valeur du quartier : ×'+d[1]+'.'+(near?"":"<br><b style='color:var(--g-fg)'>Trop loin : prends d'abord un quartier collé à celui-ci.</b>")+'</p><div class="stack"><button class="opt" data-a="take" data-v="'+i+':0" '+(!near||S.men<def?"disabled":"")+'><div><b>Prendre par la force</b><small>Il faut '+def+' hommes. Tu en perds environ un tiers. Police +25.</small></div></button><button class="opt" data-a="take" data-v="'+i+':1" '+(!near||S.cash<buy?"disabled":"")+'><div><b>Racheter le quartier</b><small>Tu paies la famille, sans bruit. Police +5.</small></div><span class="px">'+fmt(buy)+' $</span></button></div>'};
  }
  if(a==="open"){var p=String(v).split(":"),di=+p[0],t=p[1],cost=mBizCost(S,di,t);if(S.cash<cost||S.biz[di].length>=3)return;S.cash-=cost;S.biz[di].push(t);return {reopen:["dist",di],toast:M_BIZ[t].n+" ouvert"}}
  if(a==="sell"){var q=String(v).split(":");var bt=S.biz[+q[0]][+q[1]];S.cash+=mBizCost(S,+q[0],bt)*.4;S.biz[+q[0]].splice(+q[1],1);return {reopen:["dist",+q[0]],toast:"Affaire fermée"}}
  if(a==="take"){
   var r=String(v).split(":"),ti=+r[0],how=+r[1];if(!mNear(S,ti))return;
   if(how===0){var dd=mDef(S,ti);if(S.men<dd)return;var loss=Math.round(dd*rand(.25,.4));S.men-=loss;S.heat=Math.min(99,S.heat+25);S.own[ti]=1;return {close:1,modal:["Quartier pris",M_D[ti][0],"Tu as perdu "+loss+" hommes dans l'opération. Ouvre des affaires dans ce quartier."]}}
   var bb=mBuy(S,ti);if(S.cash<bb)return;S.cash-=bb;S.heat=Math.min(99,S.heat+5);S.own[ti]=1;return {close:1,modal:["Marché conclu",M_D[ti][0],"La famille a accepté ton offre. Le quartier est à toi."]};
  }
  if(a==="newcity"){var ct=S.city+1,F=this.fresh();F.city=ct;F.coups=[mOffer(F),mOffer(F)];F.cash=300*Math.pow(3,ct);F.men=4*Math.pow(2,ct);for(var key in F)S[key]=F[key];return {modal:["Nouvelle ville","Ville "+(ct+1),"Tu repars d'un seul quartier, mais tout rapporte +"+Math.round(ct*80)+" %."]}}
  if(a==="coup"){var z=String(v).split(":"),c2=S.coups[+z[0]];if(S.men<c2.need)return;S.men-=c2.need;c2.mode=+z[1];c2.end=Date.now()+c2.dur*60000;S.heat=Math.min(99,S.heat+(c2.mode?18:5));return {toast:c2.nm+" : c'est parti"}}
  if(a==="cres"){
   var cc2=S.coups[+v],ok=Math.random()<(cc2.mode?.6:.85),gain=Math.round(cc2.rew*(cc2.mode?2.5:1));
   if(ok){S.cash+=gain;S.men+=cc2.need}else{var lost=Math.ceil(cc2.need*.35);S.men+=cc2.need-lost;S.heat=Math.min(99,S.heat+10)}
   S.coups[+v]=mOffer(S);
   return {modal:ok?["Coup réussi","+"+fmt(gain)+" $",cc2.nm+" : tout le monde est rentré."]:["Coup raté","Police +10",cc2.nm+" : ça a mal tourné. "+Math.ceil(cc2.need*.35)+" hommes se sont fait arrêter."]};
  }
 },
 after:function(S){if(S._raid){var r=S._raid;delete S._raid;return {modal:["Descente de police","−"+fmt(r[0])+" $",r[1]?"La police a fermé : "+r[1]+".":"La police a saisi une partie de la caisse."]}}},
 summary:function(S){return this.rank(S).name+" · "+S.own.filter(Boolean).length+"/9 quartiers · "+fmt(S.cash)+" $"}
};

/* =========================================================
   STUDIO D'APPS : équipe, projets, sorties, classement
   ========================================================= */
var ST_TYPES=[["util","Utilitaire",1,"Tools"],["jeu","Jeu",1.4,"Quest"],["sport","Sport",1.2,"Fit"],["photo","Photo",1.5,"Cam"],["social","Réseau social",1.9,"Link"],["ia","IA",2.3,"Mind"]];
var ST_SIZES=[["Petite",240,2.2,0,1],["Moyenne",1600,13,600,2],["Grosse",9000,70,20000,4],["Énorme",45000,380,600000,8]];
var ST_OFF=[["Ta chambre",1,0],["Un garage",3,700],["Petits bureaux",6,25000],["Un étage entier",12,9e5],["Un campus",25,3e7]];
var ST_ROLES={dev:["Développeur","Code plus vite"],design:["Designer","Améliore la note"],mkt:["Marketing","Plus de téléchargements à la sortie"]};
var ST_FIRST=["Inès","Yanis","Léa","Noah","Sofia","Adam","Jade","Rayan","Lina","Hugo","Maëlys","Ilyes","Chloé","Nolan","Sarah","Malik","Emma","Théo","Nora","Bilal"];
var ST_PRE=["Nova","Pixel","Lumo","Kite","Orbit","Zest","Mira","Volt","Echo","Flux","Hop","Nimbus","Bloom","Astra","Pulse","Drift"];
function sTrend(){var k=Math.floor(Date.now()/900000);return ST_TYPES[(k*7+3)%ST_TYPES.length][0]}
function sType(id){return ST_TYPES.filter(function(t){return t[0]===id})[0]}
function sSum(S,role){return S.staff.reduce(function(a,p){return a+(p.role===role?p.lv:0)},0)}
function sSpeed(S){var v=0;S.staff.forEach(function(p){v+=p.role==="dev"?p.lv*2:p.role==="design"?p.lv*.6:p.lv*.3});return v*(S.cash<=0&&sSal(S)>0?.3:1)}
function sSal(S){return S.staff.reduce(function(a,p){return a+p.sal},0)}
function sDl(a,now){var age=(now-a.born)/1000;return a.peak*(.18+.82*Math.exp(-age/1500))}
function sRev(S){var now=Date.now(),t=0;S.apps.forEach(function(a){t+=sDl(a,now)*sType(a.type)[2]*2});return t}
function sTotalDl(S){var now=Date.now();return S.apps.reduce(function(t,a){return t+sDl(a,now)},0)}
function sRankNum(S){return Math.max(1,Math.round(150000/Math.pow(1+sTotalDl(S),1.3)))}
function sCand(S){var maxLv=Math.min(10,2+S.office*2),out=[];for(var k=0;k<3;k++){var role=pick(["dev","dev","design","mkt"]),lv=ri(1,Math.max(1,ri(1,maxLv)));out.push({n:pick(ST_FIRST),role:role,lv:lv,fee:Math.round(90*Math.pow(lv,2.4)),sal:+(.3*Math.pow(lv,1.8)).toFixed(2)})}return out}
var Studio={
 id:"studio",name:"Studio d'apps",full:"Studio d'apps Tycoon",cls:"th-studio",unit:"€",tag:"Sors des applis, vise le numéro 1",
 tabs:[["proj","Projet"],["team","Équipe"],["apps","Mes apps"]],
 fresh:function(){var S={cash:250,office:0,staff:[{n:"Toi",role:"dev",lv:1,sal:0,me:1}],cand:[],candAt:0,proj:null,apps:[],best:150000,made:0};S.cand=sCand(S);S.candAt=Date.now();return S},
 step:function(S,dt){
  S.cash+=(sRev(S)-sSal(S))*dt;if(S.cash<0)S.cash=0;
  if(S.proj&&S.proj.pts<S.proj.need){S.proj.pts=Math.min(S.proj.need,S.proj.pts+sSpeed(S)*dt)}
  if(Date.now()-S.candAt>180000){S.cand=sCand(S);S.candAt=Date.now()}
  var r=sRankNum(S);if(r<S.best)S.best=r;
 },
 top:function(S){var r=sRankNum(S);return '<div class="chip"><em>Trésorerie</em><b>'+fmt(S.cash)+' €</b><small>'+(sRev(S)-sSal(S)>=0?"+":"")+fmt(sRev(S)-sSal(S))+' €/s</small></div><div class="chip"><em>Classement</em><b>#'+r.toLocaleString("fr-FR")+'</b><small>'+fmt(sTotalDl(S)*3600)+' télécharg./h</small></div>'},
 rank:function(S){var r=sRankNum(S),sc=Math.log10(150000/r);var name=r===1?"Numéro 1 du Store":"#"+r.toLocaleString("fr-FR");var tiers=[150000,50000,10000,1000,100,10,1],nx=tiers.filter(function(t){return t<r})[0];var lo=tiers.filter(function(t){return t>=r}).pop()||150000;return {name:name,next:nx?"Top "+nx.toLocaleString("fr-FR"):null,p:nx?clamp((Math.log10(lo)-Math.log10(r))/(Math.log10(lo)-Math.log10(nx)),0,1):1}},
 badge:function(S,t){if(t==="proj"&&S.proj&&S.proj.pts>=S.proj.need)return "!";return ""},
 sig:function(S,tab){
  if(tab==="proj")return (S.proj?"p"+(S.proj.pts>=S.proj.need):"n")+S.staff.length+sTrend()+(S.cash>=600)+(S.cash>=20000)+(S.cash>=6e5);
  if(tab==="team")return S.staff.length+"|"+S.cand.map(function(c){return c.n+c.lv+(S.cash>=c.fee)}).join()+"|"+S.office+(S.cash>=(ST_OFF[S.office+1]||[0,0,Infinity])[2]);
  return S.apps.length+"|"+S.apps.map(function(a){return S.cash>=a.peak*240?1:0}).join("")+"|"+Math.floor(Date.now()/5000);
 },
 body:function(S,tab){
  var tr=sTrend(),trN=sType(tr)[1];
  if(tab==="proj"){
   if(S.proj){var p=S.proj,done=p.pts>=p.need,sp=sSpeed(S);
    return '<div class="card"><div class="lbl">En développement</div><h6 style="font-size:20px;margin-top:4px">'+esc(p.name)+'</h6><div class="meta">'+sType(p.type)[1]+' · '+ST_SIZES[p.size][0]+(p.type===tr?' · <span class="tag acc">Tendance</span>':"")+'</div><div class="pbar"><i id="sProg" style="width:'+(p.pts/p.need*100).toFixed(1)+'%"></i></div><div class="meta" id="sProgT">'+(done?"Terminé !":fmt(p.pts)+" / "+fmt(p.need)+" lignes · reste "+fmtTime((p.need-p.pts)/Math.max(.01,sp)))+'</div>'
     +(done?'<div class="btns"><button class="btn acc wide" data-a="release">Sortir l\'appli sur le Store</button></div>':'')+'</div><p class="hint" style="margin-top:12px">Plus de développeurs = plus rapide. Des designers = meilleure note. Du marketing = plus de téléchargements à la sortie.</p>';}
   var h='<p class="hint">Tendance du moment : <b>'+trN+'</b> (×1,5 téléchargements et meilleure note). Elle change tous les quarts d\'heure.</p><div class="card"><div class="lbl">Nouvelle appli</div><div class="lbl" style="margin-top:12px">Type</div><div class="seg" id="sType">'+ST_TYPES.map(function(t){return '<button data-a="ptype" data-v="'+t[0]+'" class="'+(S._pt===t[0]?"on":"")+'">'+t[1]+(t[0]===tr?" ★":"")+'</button>'}).join("")+'</div><div class="lbl">Taille</div><div class="seg">'+ST_SIZES.map(function(z,k){var ok=S.staff.length>=z[4];return '<button data-a="psize" data-v="'+k+'" class="'+((S._ps||0)===k?"on":"")+'" '+(ok?"":"disabled")+'>'+z[0]+(z[3]?" · "+fmt(z[3])+" €":"")+(ok?"":" · "+z[4]+" pers.")+'</button>'}).join("")+'</div>';
   var z=ST_SIZES[S._ps||0];h+='<div class="meta">Durée estimée : '+fmtTime(z[1]/Math.max(.01,sSpeed(S)))+' avec ton équipe actuelle.</div><div class="btns"><button class="btn acc wide" data-a="start" '+(S.cash<z[3]||!S._pt?"disabled":"")+'>'+(S._pt?"Lancer le projet":"Choisis un type")+'</button></div></div>';
   if(!S.apps.length)h+='<p class="hint" style="margin-top:12px">Commence par une petite appli. Elle se code toute seule pendant que tu fais autre chose.</p>';
   return h;
  }
  if(tab==="team"){
   var cap=ST_OFF[S.office][1],nx=ST_OFF[S.office+1];
   var h2='<div class="card"><div class="row2"><div><h6>'+ST_OFF[S.office][0]+'</h6><div class="meta">'+S.staff.length+' / '+cap+' places · salaires '+fmt(sSal(S))+' €/s</div></div>'+(nx?'<button class="btn" data-a="office" '+(S.cash<nx[2]?"disabled":"")+'>'+nx[0]+'<small>'+fmt(nx[2])+' € · '+nx[1]+' places</small></button>':"")+'</div></div><div class="lbl" style="margin:16px 2px 8px">Ton équipe</div><div class="stack">';
   S.staff.forEach(function(p,k){h2+='<div class="card"><div class="row2"><div><h6>'+esc(p.n)+' <span class="tag">'+ST_ROLES[p.role][0]+' niv. '+p.lv+'</span></h6><div class="meta">'+(p.me?"Fondateur · pas de salaire":fmt(p.sal)+" €/s")+'</div></div>'+(p.me?"":'<button class="btn ghost" data-a="fire" data-v="'+k+'">Renvoyer</button>')+'</div></div>'});
   h2+='</div><div class="lbl" style="margin:16px 2px 8px">CV reçus <span style="text-transform:none;letter-spacing:0">· nouveaux toutes les 3 min</span></div><div class="stack">';
   S.cand.forEach(function(c,k){h2+='<div class="card"><div class="row2"><div><h6>'+c.n+' <span class="tag acc">'+ST_ROLES[c.role][0]+' niv. '+c.lv+'</span></h6><div class="meta">'+ST_ROLES[c.role][1]+' · salaire '+fmt(c.sal)+' €/s</div></div><button class="btn" data-a="hire" data-v="'+k+'" '+(S.cash<c.fee||S.staff.length>=cap?"disabled":"")+'>'+(S.staff.length>=cap?"Plus de place":"Embaucher")+'<small>'+fmt(c.fee)+' €</small></button></div></div>'});
   return h2+'</div>';
  }
  if(!S.apps.length)return '<div class="card"><h6>Aucune appli sortie</h6><div class="meta">Lance ton premier projet dans l\'onglet Projet.</div></div>';
  var now=Date.now(),list=S.apps.slice().sort(function(a,b){return sDl(b,now)-sDl(a,now)});
  return '<p class="hint">Les téléchargements baissent avec le temps. Une mise à jour relance ton appli.</p><div class="stack">'+list.slice(0,25).map(function(a){var i=S.apps.indexOf(a),dl=sDl(a,now),uc=a.peak*240;return '<div class="card"><div class="row2"><div><h6>'+esc(a.name)+' <span class="tag">v'+a.v+'</span></h6><div class="meta"><span class="stars">'+"★★★★★".slice(0,Math.round(a.q))+'</span><span style="opacity:.35">'+"★★★★★".slice(0,5-Math.round(a.q))+'</span> '+a.q.toFixed(1).replace(".",",")+' · '+sType(a.type)[1]+'<br>'+fmt(dl*3600)+' télécharg./h · '+fmt(dl*sType(a.type)[2]*2)+' €/s</div></div><button class="btn ghost" data-a="update" data-v="'+i+'" '+(S.cash<uc?"disabled":"")+'>Mise à jour<small>'+fmt(uc)+' €</small></button></div></div>'}).join("")+'</div>';
 },
 live:function(S){var p=S.proj,el=document.getElementById("sProg");if(p&&el){el.style.width=(p.pts/p.need*100).toFixed(1)+"%";var t=document.getElementById("sProgT");if(t&&p.pts<p.need)t.textContent=fmt(p.pts)+" / "+fmt(p.need)+" lignes · reste "+fmtTime((p.need-p.pts)/Math.max(.01,sSpeed(S)))}},
 act:function(S,a,v){
  if(a==="ptype"){S._pt=v;return {}}
  if(a==="psize"){S._ps=+v;return {}}
  if(a==="start"){var z=ST_SIZES[S._ps||0];if(!S._pt||S.cash<z[3]||S.staff.length<z[4])return;S.cash-=z[3];S.proj={type:S._pt,size:S._ps||0,pts:0,need:z[1],name:pick(ST_PRE)+" "+sType(S._pt)[3]};return {toast:"Projet lancé : "+S.proj.name}}
  if(a==="release"){
   var p=S.proj;if(!p||p.pts<p.need)return;var n=S.staff.length,avg=S.staff.reduce(function(x,q){return x+q.lv},0)/n,ds=S.staff.filter(function(q){return q.role==="design"}).length/n,tr=p.type===sTrend();
   var q=clamp(2.1+avg*.3+Math.min(1,ds*2.5)*1+(tr?.6:0)+p.size*.15+rand(-.4,.4),1,5);q=Math.round(q*10)/10;
   var peak=ST_SIZES[p.size][2]*Math.pow(q/3,2.2)*(1+sSum(S,"mkt")*.25)*(tr?1.5:1);
   S.apps.push({name:p.name,type:p.type,q:q,peak:peak,born:Date.now(),v:1});S.proj=null;S.made++;
   return {modal:["Appli sortie !",p.name,"Note des utilisateurs : "+q.toFixed(1).replace(".",",")+" / 5. Démarrage à "+fmt(peak*3600)+" téléchargements par heure."]};
  }
  if(a==="hire"){var c=S.cand[+v];if(!c||S.cash<c.fee||S.staff.length>=ST_OFF[S.office][1])return;S.cash-=c.fee;S.staff.push({n:c.n,role:c.role,lv:c.lv,sal:c.sal});S.cand.splice(+v,1);return {toast:c.n+" rejoint le studio"}}
  if(a==="fire"){var f=S.staff[+v];if(!f||f.me)return;S.staff.splice(+v,1);return {toast:f.n+" quitte le studio"}}
  if(a==="office"){var nx=ST_OFF[S.office+1];if(!nx||S.cash<nx[2])return;S.cash-=nx[2];S.office++;return {toast:"Nouveau local : "+nx[0]}}
  if(a==="update"){var ap=S.apps[+v],uc=ap.peak*240;if(S.cash<uc)return;S.cash-=uc;ap.peak*=1.12;ap.born=Date.now();ap.v++;ap.q=Math.min(5,Math.round((ap.q+.1)*10)/10);return {toast:ap.name+" v"+ap.v+" est en ligne"}}
 },
 summary:function(S){return (sRankNum(S)===1?"Numéro 1":"#"+sRankNum(S).toLocaleString("fr-FR"))+" · "+S.apps.length+" appli"+(S.apps.length>1?"s":"")+" · "+fmt(S.cash)+" €"}
};

var GAMES={bastion:Bastion,mafia:Mafia,studio:Studio};
var GIDS=["bastion","mafia","studio"];
function gload(id){var s=store.get("lima2."+id);if(!s||typeof s!=="object"){s=GAMES[id].fresh();s.last=Date.now();s.isNew=1}return s}
function gsave(id,s){s.last=Date.now();store.set("lima2."+id,s)}
