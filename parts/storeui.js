/* ---------- MY PHONE APPS ---------- */
var PRESETS=[["YouTube","https://www.youtube.com","#E0261B"],["TikTok","https://www.tiktok.com","#121212"],["Instagram","https://www.instagram.com","#B4307A"],["Snapchat","snapchat://","#F2D500"],["WhatsApp","whatsapp://","#1FA855"],["Spotify","https://open.spotify.com","#169C46"],["Netflix","https://www.netflix.com","#A30A12"],["Discord","https://discord.com/app","#5865F2"],["Twitch","https://www.twitch.tv","#7B3FE4"],["X","https://x.com","#121212"],["Telegram","tg://","#2A9FD8"],["Plans","maps://","#3A9A4B"]];
var COLORS=["#007AFF","#FF9500","#34C759","#AF52DE","#FF2D55","#5AC8FA","#FFCC00"];
var editMode=false,stab="today";
try{stab=localStorage.getItem("pop.tab")||"island"}catch(e){}
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
 $("#overlay").innerHTML='<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Ajouter une app"><div class="grab"></div><button class="closex" data-close="1" aria-label="Fermer">'+XSVG+'</button><h5 style="font-family:var(--f-sysd);font-size:28px;font-weight:700;margin:6px 0 0;letter-spacing:-.02em">Ajouter une app</h5><p style="color:var(--label2);margin-top:4px">Touche une app pour l\'ajouter à Pop.</p><div class="presets">'
  +PRESETS.filter(function(p){return mine.indexOf(p[0])<0}).map(function(p){return '<button class="app" data-preset="'+p[0]+'"><span class="ic">'+letterIcon({n:p[0],c:p[2]})+'</span><b>'+p[0]+'</b></button>'}).join("")
  +'</div><label class="lbl2" for="addName">Une autre app</label><input class="field" id="addName" placeholder="Nom (ex. Deezer)" autocomplete="off"><input class="field" id="addUrl" placeholder="Lien (ex. deezer.com)" autocomplete="off" inputmode="url" autocapitalize="none"><button class="btn-s" data-addcustom="1">Ajouter</button><div class="note">L\'app s\'ouvre si elle est installée sur ton iPhone, sinon c\'est son site qui s\'ouvre.</div></div>';
}

/* ---------- STORE (App Store layout) ---------- */
var TABS=[
 ["island","Île",'<svg viewBox="0 0 28 28" fill="currentColor"><path d="M3 21.5c2.2 0 2.2-1.2 4.4-1.2s2.2 1.2 4.4 1.2 2.2-1.2 4.4-1.2 2.2 1.2 4.4 1.2 2.2-1.2 4.4-1.2v2.2c-2.2 0-2.2 1.2-4.4 1.2s-2.2-1.2-4.4-1.2-2.2 1.2-4.4 1.2-2.2-1.2-4.4-1.2S5.2 23.7 3 23.7Z" opacity=".6"/><path d="M13 19V9.6C10.7 8 8 8.6 6.3 10.4 8.1 9.8 10 10 11.4 11 9 11.5 7.4 13.4 7 15.6c1.3-1.5 3.2-2.4 5-2.5V19Zm1.6 0h-1.2l.3-8.4c1-2 3.2-3.3 5.5-3.1-1.7.6-2.9 1.6-3.6 2.8 2.6-.8 5.3.2 6.6 2.3-2-.9-4.2-.8-6 .1Z"/><ellipse cx="14" cy="19.6" rx="7.5" ry="1.8"/></svg>'],
 ["today","Aujourd'hui",'<svg viewBox="0 0 28 28" fill="currentColor"><rect x="4" y="4" width="20" height="13" rx="3.5"/><rect x="4" y="19.5" width="20" height="4.5" rx="2.25" opacity=".55"/></svg>'],
 ["games","Jeux",'<svg viewBox="0 0 28 28" fill="currentColor"><path d="M9 8h10a6 6 0 0 1 5.7 7.9l-1.2 3.7a2.8 2.8 0 0 1-4.6 1.1L16.6 18h-5.2l-2.3 2.7a2.8 2.8 0 0 1-4.6-1.1l-1.2-3.7A6 6 0 0 1 9 8Zm0 3.2v1.6H7.4v1.6H9V16h1.6v-1.6h1.6v-1.6h-1.6v-1.6Zm9.6 1.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm2.4-2.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z"/></svg>'],
 ["apps","Apps",'<svg viewBox="0 0 28 28" fill="currentColor"><path d="M14 3.5 24 9v10l-10 5.5L4 19V9Z" opacity=".35"/><path d="M14 3.5 24 9l-10 5.5L4 9Z"/><path d="M14 14.5v10L4 19V9Z" opacity=".7"/></svg>'],
 ["search","Rechercher",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/></svg>']];
var GAME_APPS=["breche","qg","nocta","volta","frequence","champion"];
var SHOTS={ascendant:3,azimut:3,breche:3,bastion:2,mafia:2,studio:2,champion:2,ciel:3,frequence:2,nocta:3,qg:3,velours:2,volta:2,kino:2,halo:2};
var CAN_SHOTS=ON_PAGES||/^(localhost|127\.)/.test(location.hostname);
function shot(id,i){return "shots/"+id+"-"+i+".jpg?v=1"}
var THEME={ascendant:["#1A2350","#5B3FD6"],azimut:["#0B171B","#1E5560"],velours:["#1A0D1C","#9C3550"],nocta:["#141B33","#3B4A8C"],qg:["#1E2022","#5A5F45"],champion:["#0F0D12","#B4562A"],ciel:["#243A6B","#E3A86C"],frequence:["#0B120E","#245A36"],volta:["#0B0B0F","#3A2A7A"],kino:["#000000","#3A2E1A"],halo:["#FF3DA0","#3CE1FF"],breche:["#07080C","#6A2A12"],bastion:["#12150D","#4A5530"],mafia:["#120A09","#5A2A1E"],studio:["#080A16","#2A3A8A"]};
var TYC_DESC={bastion:"Construis ta base case par case : le mess booste les ateliers voisins, le hangar débloque les blindés et la piste les avions. Envoie tes soldats en mission et grimpe de Recrue à Général d'armée. Tout tourne même quand l'appli est fermée.",mafia:"Ville portuaire, années 1930. Tu tiens un seul quartier. Ouvre des affaires, recrute des hommes et prends les quartiers voisins aux trois familles rivales. Surveille la police : à 100 % de chaleur, c'est la descente.",studio:"Lance ta première petite appli, embauche des développeurs, des designers et des pros du marketing, suis les tendances et grimpe de la place #100 000 jusqu'à la première place du classement."};
var AGE={velours:"18+",mafia:"12+",qg:"12+",breche:"12+",champion:"9+",frequence:"9+",bastion:"9+"};
var NEWS={halo:["17 nov.","Première version : 19 morceaux originaux, mix du jour, playlists, titres likés et import de tes sons."],kino:["17 nov.","Première version : films et séries du domaine public, profils, reprise de lecture et tes propres vidéos."],breche:["17 nov.","Première version : six brèches, des boss, du butin, des compétences, la légion d'échos et la renaissance."],volta:["16 nov.","Première version : 24 pads et trois styles, Nuit, Néon et Pluie."],bastion:["16 nov.","Nouvelle version : ta base se construit case par case et tes soldats partent en mission."],mafia:["16 nov.","Nouvelle version : quartiers à prendre, police, avocat et coups."],studio:["16 nov.","Nouvelle version : équipe à embaucher, projets selon les tendances et classement du Store."]};
var CATS=[["Jeux","#FF9F0A",["breche"].concat(GAME_APPS.slice(1),GIDS)],["Sport","#5856D6",["ascendant"]],["Terrain","#30B0C7",["qg","azimut","frequence","champion","bastion"]],["Musique","#FF375F",["halo","volta"]],["Films","#FF453A",["kino"]],["Entre potes","#E0A800",["nocta"]],["Rencontre","#FF2D55",["velours"]],["Journal","#64D2FF",["ciel"]],["Tycoon","#AC8E68",["mafia","bastion","studio"]]];
var SPRING="cubic-bezier(.2,.9,.25,1)";
try{if(CSS.supports("transition-timing-function","linear(0,1)"))SPRING="linear(0,.012 1%,.05 2.2%,.2 5%,.58 11.6%,.78 16.2%,.9 20.8%,.97 25.6%,1.01 30.6%,1.025 36%,1.02 43%,1.006 55%,1)"}catch(e){}
var REDUCE=false;try{REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}

function A_(id){return APPS.filter(function(a){return a.id===id})[0]}
function item(id){var a=A_(id);if(a)return {id:id,name:a.name,cat:a.cat,tag:a.tag,desc:a.desc,url:a.url,live:a.live,game:/^Jeu/.test(a.cat)};var g=GAMES[id];return {id:id,name:g.full,cat:"Jeux · Tycoon",tag:g.tag,desc:TYC_DESC[id],tycoon:true,game:true}}
function allIds(){return APPS.map(function(a){return a.id}).concat(GIDS)}
function catName(it){return it.cat.split(" · ").pop()}
function ratings(){var r=store.get("lima.ratings");return r&&typeof r==="object"?r:{}}
function opens(id){var s=stats();if(GAMES[id]){var g=store.get("lima2."+id);return (s.opens[id]||0)+(g&&g.last?1:0)}return s.opens[id]||0}
function ranked(ids){return ids.map(function(id,i){return [id,i]}).sort(function(a,b){return (opens(b[0])-opens(a[0]))||((ratings()[b[0]]||0)-(ratings()[a[0]]||0))||(a[1]-b[1])}).map(function(x){return x[0]})}
function getBtn(id,cls){var it=item(id);cls=cls?" "+cls:"";if(it.tycoon)return '<button class="pill'+cls+'" data-game="'+id+'">Ouvrir</button>';return '<a class="pill'+cls+'" data-track="'+id+'" href="'+esc(it.url)+'" target="_blank" rel="noopener">Ouvrir</a>'}
function sub(id){var it=item(id);if(it.tycoon){var s=store.get("lima2."+id);if(s&&s.last)return GAMES[id].summary(s)}return it.tag}
function arow(a,n){var id=typeof a==="string"?a:a.id,it=item(id);return '<div class="arow" data-detail="'+id+'" role="button" tabindex="0">'+(n?'<span class="rk">'+n+'</span>':"")+icn(id)+'<span class="t"><b>'+esc(it.name)+'</b><small>'+esc(sub(id))+'</small></span>'+getBtn(id)+'</div>'}
function grow(id){return arow(id)}
var CHEV='<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>';
function largeTitle(t,showDate){var d=new Date();return '<div class="lt"><div>'+(showDate?'<div class="date">'+d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+'</div>':"")+'<h1>'+t+'</h1></div><div class="ltb"><button class="avatar" data-profile="1" aria-label="Mon profil">'+limaLogo("#121316")+'</button></div></div>'}
function hdr(t,small,more){return '<div class="hdr"><div><h2>'+(more?'<button class="hlink" data-list="'+more+'">'+t+CHEV+'</button>':t)+'</h2>'+(small?'<small>'+small+'</small>':"")+'</div>'+(more?'<button class="link" data-list="'+more+'">Tout voir</button>':"")+'</div>'}
function lastGame(){var best=null;GIDS.forEach(function(id){var s=store.get("lima2."+id);if(s&&s.last&&(!best||s.last>best.s.last))best={id:id,s:s}});return best}

/* --- art helpers --- */
var PADS=["#FF5D5D","#FF5D5D","#9B6BFF","#3FA7FF","#9B6BFF","#2FD69A","#3FA7FF","#2FD69A","#FFB23F","#2FD69A","#FF5D5D","#FFB23F","#3FA7FF","#FFB23F","#9B6BFF","#FF5D5D"];
function artHTML(kind){
 if(kind==="volta")return '<div class="art padart">'+PADS.map(function(c,i){return '<i style="background:'+c+';color:'+c+';--d:'+((i*0.37)%1.9).toFixed(2)+'s"></i>'}).join("")+'</div>';
 if(kind==="ciel")return '<div class="art cielart"><i class="sun"></i><i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i></div>';
 if(kind==="nocta")return '<div class="art noctart"><div class="ring"><b style="--c:#F4E04D;--a:0deg"></b><b style="--c:#FF6FA8;--a:72deg"></b><b style="--c:#5FD38D;--a:144deg"></b><b style="--c:#4FA8FF;--a:216deg"></b><b style="--c:#FF9F43;--a:288deg"></b></div><span>NOCTA</span></div>';
 return '<canvas data-art="'+kind+'"></canvas>';
}
function phoneArt(id){var t=THEME[id]||["#222","#555"];return '<div class="bart" style="--c1:'+t[0]+';--c2:'+t[1]+'">'+(CAN_SHOTS&&SHOTS[id]?'<img class="ph p2" loading="lazy" alt="" src="'+shot(id,Math.min(2,SHOTS[id]))+'"><img class="ph p1" loading="lazy" alt="" src="'+shot(id,1)+'">':"")+'<span class="bic">'+icn(id)+'</span></div>'}

/* --- Today stories --- */
var STORY={
 breche:{k:"Jeu du jour",t:"Traverse les brèches, deviens rang S",art:"breche",app:"breche",dark:1,lead:"Un jour, des fissures se sont ouvertes dans le ciel. Des monstres en sont sortis.",body:["Dans <b>Brèche</b>, tu es un chasseur de rang E, le plus faible de tous. Ton héros avance tout seul, enchaîne les monstres et ramasse le butin. Toi, tu choisis l'équipement, les compétences à améliorer et le bon moment pour affronter le boss.","@breche-1","Six brèches t'attendent, des Tunnels oubliés jusqu'à la Couronne du vide. Chaque boss vaincu peut rejoindre ta légion d'échos et se battre à tes côtés.","@breche-2","Et quand tu fermes l'appli, ton chasseur continue de chasser. Reviens plus tard, le butin t'attend."]},
 volta:{k:"À essayer",t:"Deviens DJ en trois pads",art:"volta",app:"volta",dark:1,lead:"Pas besoin de savoir jouer d'un instrument.",body:["<b>Volta</b>, ce sont 24 pads lumineux : rythmes, basses, accords, mélodies et effets. Touche-les dans l'ordre que tu veux, tout reste en rythme, toujours.","@volta-1","Trois styles t'attendent : Nuit pour la trap, Néon pour la house et Pluie pour le lo-fi. Monte le son et enlève le mode silencieux."]},
 ciel:{k:"Petit rituel du soir",t:"Ton humeur devient un ciel",art:"ciel",app:"ciel",dark:1,lead:"Trente secondes chaque soir, et ton mois se raconte tout seul.",body:["Dans <b>Ciel</b>, trois curseurs : ton humeur, ton énergie et ta clarté. Ajoute un mot, et l'appli dessine un ciel animé rien qu'à toi.","@ciel-1","Jour après jour, ton calendrier devient une collection de ciels. D'un coup d'œil, tu vois comment s'est passé ton mois.","@ciel-2"]},
 nocta:{k:"Entre potes",t:"Un seul téléphone pour toute la table",art:"nocta",app:"nocta",dark:1,lead:"Ce soir, on joue à quoi ?",body:["<b>Nocta</b>, c'est le petit bac, le mot interdit et le croquis, sur un seul téléphone qu'on se passe autour de la table. De 1 à 8 joueurs.","@nocta-1","Pas de compte, rien à installer : tu lances une partie et c'est parti.","@nocta-2"]},
 bastion:{k:"Dossier Tycoon",t:"Construis ta base, envoie tes troupes",art:"bastion",app:"bastion",dark:1,lead:"Pas besoin de cliquer en boucle : tout tourne tout seul.",body:[TYC_DESC.bastion,"@bastion-1","@bastion-2"]},
 mafia:{k:"Dossier Tycoon",t:"Prends la ville quartier par quartier",art:"mafia",app:"mafia",dark:1,lead:"Trois familles se partagent le port. Plus pour longtemps.",body:[TYC_DESC.mafia,"@mafia-1","@mafia-2"]},
 studio:{k:"Dossier Tycoon",t:"Vise la première place du Store",art:"studio",app:"studio",dark:1,lead:"Tout commence par une petite appli.",body:[TYC_DESC.studio,"@studio-1","@studio-2"]},
 mine:{k:"Tes créations",t:"Ce que tu as construit",list:["ascendant","azimut","velours","ciel"],all:APPS.map(function(a){return a.id}),lead:"Toutes les applis de Seven, au même endroit."},
 terrain:{k:"Collection",t:"Côté terrain",list:["qg","azimut","frequence","champion"],all:["qg","azimut","frequence","champion","bastion"],lead:"Boussole, radio de nuit, missions tactiques et base militaire. Ces applis ne sont pas officielles."}
};
function storyCard(key,over){
 var st=STORY[key],k=over&&over.k||st.k,t=over&&over.t||st.t;
 if(st.list)return '<div class="tcard list press" data-story="'+key+'" role="button" tabindex="0"><div class="cap"><div class="k">'+k+'</div><h3>'+t+'</h3></div><div class="rows">'+st.list.map(function(id){return arow(id)}).join("")+'</div></div>';
 var ph=st.art==="volta"?"":(CAN_SHOTS&&SHOTS[st.app]?'<div class="hph"><img alt="" src="'+shot(st.app,1)+'"></div>':'<div class="hic">'+icn(st.app)+'</div>');
 return '<div class="tcard tall ptile press" data-story="'+key+'" role="button" tabindex="0">'+artHTML(st.art)+'<div class="tx"><em>'+k+'</em><h3>'+esc(item(st.app).name)+'</h3><p>'+t+'</p><div class="ctas">'+getBtn(st.app,"solid")+'<span class="ghost">En savoir plus</span></div></div>'+ph+'</div>';
}
function viewToday(){
 var best=lastGame(),fid=best?best.id:"mafia",other=fid==="studio"?"bastion":"studio";
 var h=largeTitle("Aujourd'hui",true)+'<div class="today">';
 h+=storyCard("breche");
 h+=storyCard(fid,best?{k:"Reprends ta partie",t:{bastion:"Tes soldats t'attendent",mafia:"La ville n'attend que toi",studio:"Vise la première place"}[fid]}:{k:"Nouveau dans Lima"});
 h+=storyCard("mine");
 h+=storyCard("volta");
 h+=storyCard("ciel");
 h+=storyCard("terrain");
 h+=storyCard("nocta");
 h+=storyCard(other);
 return h+'</div><div class="foottxt">Tu es à jour.<br>Reviens demain pour d\'autres idées.</div>';
}

/* --- banners, charts, tabs --- */
function chips(ids){return '<div class="chips2">'+ids.map(function(id){return '<button data-detail="'+id+'">'+icn(id)+'<b>'+esc(item(id).name.replace(" Tycoon",""))+'</b></button>'}).join("")+'</div>'}
function banners(list){return '<div class="hs bn">'+list.map(function(b){return '<div class="bnr" data-detail="'+b[0]+'" role="button" tabindex="0"><div class="be">'+b[1]+'</div><h3>'+b[2]+'</h3><p>'+b[3]+'</p>'+phoneArt(b[0])+'</div>'}).join("")+'</div>'}
function chart(ids){return '<div class="hs rows3">'+ranked(ids).map(function(id,i){return arow(id,i+1)}).join("")+'</div>'}
function viewApps(){
 var mine=myApps(),appIds=APPS.filter(function(a){return GAME_APPS.indexOf(a.id)<0}).map(function(a){return a.id});
 var h=largeTitle("Apps")+chips(APPS.map(function(a){return a.id}).filter(function(id){return GAME_APPS.indexOf(id)<0}));
 h+=banners([["ascendant","À LA UNE","Ascendant","Tes séances deviennent des quêtes"],["azimut","OUTIL DE TERRAIN","Azimut","Boussole, MGRS et paquetage"],["velours","RENCONTRE","Velours","Entre filles qui s'aiment"],["ciel","CHAQUE SOIR","Ciel","Ton humeur devient un ciel"]]);
 h+=hdr("Tes indispensables","Faites par Seven","apps")+'<div class="hs rows3">'+appIds.map(function(id){return arow(id)}).join("")+'</div>';
 h+=hdr("Top Apps","Celles que tu ouvres le plus","topapps")+chart(appIds);
 h+=hdr("Accès rapide")+'<div class="grid">'+APPS.map(function(a){return '<button class="app" data-app="'+a.id+'">'+icn(a.id)+'<b>'+a.name+'</b></button>'}).join("")+'<button class="app folder" data-folder="1"><span class="ic"><i>'+ICON.bastion+'</i><i>'+ICON.mafia+'</i><i>'+ICON.studio+'</i><i>'+ICON.breche+'</i></span><b>Tycoon & RPG</b></button></div>';
 h+='<div class="hdr"><div><h2>Mon iPhone</h2><small>Tes autres apps</small></div>'+(mine.length?'<button class="link" data-edit="1">'+(editMode?"OK":"Modifier")+'</button>':"")+'</div><div class="grid">'+mine.map(myTile).join("")+(editMode?"":'<button class="app" data-add="1"><span class="ic addic">+</span><b>Ajouter</b></button>')+'</div>';
 return h+'<div class="foottxt">Pop · '+allIds().length+' créations</div>';
}
function viewGames(){
 var h=largeTitle("Jeux")+chips(GAME_APPS.concat(GIDS));
 h+=banners([["breche","NOUVEAU JEU","Brèche","De chasseur E au rang S"],["qg","QUATRE MISSIONS","QG","Tactique, histoire, tir et commandement"],["nocta","ENTRE POTES","Nocta","Petit bac, mot interdit, croquis"],["frequence","LA NUIT","Fréquence","Décode les messages du QG"]]);
 h+=hdr("Dossier Tycoon & RPG","Ça tourne même quand l'appli est fermée")+'<div class="hs big">'+GIDS.map(function(id){var s=store.get("lima2."+id),g=GAMES[id];return '<div class="gcard press" data-detail="'+id+'" role="button" tabindex="0"><canvas data-art="'+id+'"></canvas><div class="cap"><div class="k">Tycoon</div><h3>'+g.full+'</h3><p>'+g.tag+'</p></div><div class="foot">'+icn(id)+'<div>'+(s&&s.last?g.summary(s):"Nouvelle partie")+'</div>'+getBtn(id,"glass")+'</div></div>'}).join("")+'</div>';
 h+=hdr("Top Jeux","Tes jeux les plus lancés","topgames")+chart(GAME_APPS.concat(GIDS));
 h+=hdr("Tous les jeux")+'<div class="groupcard">'+GAME_APPS.concat(GIDS).map(function(id){return arow(id)}).join("")+'</div>';
 return h;
}
function viewSearch(){
 var h='<div class="lt"><div><h1>Rechercher</h1></div><div class="ltb"><button class="avatar" data-profile="1" aria-label="Mon profil">'+limaLogo("#121316")+'</button></div></div>';
 h+='<button class="sfield" data-search="1"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/></svg>Apps, jeux, réglages…</button>';
 h+='<div class="hdr" style="border-top:0"><div><h2>Découvrir</h2></div></div><div class="disc">'+["brèche","boussole","musique","entre potes","tycoon","rencontre"].map(function(q){return '<button data-q="'+q+'"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/></svg>'+q+'</button>'}).join("")+'</div>';
 h+='<div class="hdr"><div><h2>Catégories</h2></div></div><div class="cats">'+CATS.map(function(c,i){return '<button class="cat press" data-cat="'+i+'" style="--c:'+c[1]+'"><b>'+c[0]+'</b><span>'+c[2].slice(0,1).map(function(id){return icn(id)}).join("")+'</span></button>'}).join("")+'</div>';
 return h;
}
function renderStore(){
 var el=$("#store");
 var v=stab==="island"?viewIsland():stab==="apps"?viewApps():stab==="games"?viewGames():stab==="search"?viewSearch():viewToday();
 var isle=$("#isle");if(!isle){isle=document.createElement("div");isle.id="isle";document.body.insertBefore(isle,$("#game"))}
 if(stab==="island"){el.innerHTML="";isle.innerHTML=v}else{isle.innerHTML="";el.innerHTML='<div class="view">'+v+'</div>'}
 var nav=$("#navT");if(!nav){document.body.insertAdjacentHTML("beforeend",'<div class="nav" id="navT"></div><nav class="tabbar" id="tabbar"></nav>');nav=$("#navT")}
 nav.textContent=TABS.filter(function(t){return t[0]===stab})[0][1];
 var tb=$("#tabbar"),ix=["island","today","games","apps"].indexOf(stab);
 if(!tb.firstChild)tb.innerHTML='<div class="tbpill"><i class="tbind"></i>'+TABS.slice(0,4).map(function(t){return '<button data-stab="'+t[0]+'">'+t[2]+'<span>'+t[1]+'</span></button>'}).join("")+'</div><button class="tbsearch" data-stab="search" aria-label="Rechercher">'+TABS[4][2]+'</button>';
 tb.querySelectorAll("[data-stab]").forEach(function(b){b.classList.toggle("on",b.dataset.stab===stab)});
 tb.style.setProperty("--i",Math.max(0,ix));tb.classList.toggle("nosel",ix<0);
 document.documentElement.classList.toggle("onisland",stab==="island");if(stab==="island")initIsland();else IS=null;
 document.querySelectorAll("#store canvas[data-art]").forEach(function(c){drawArt(c,c.dataset.art)});
 onScroll();
}
function onScroll(){var n=$("#navT");if(n)n.classList.toggle("show",window.scrollY>44&&!cur)}
window.addEventListener("scroll",onScroll,{passive:true});
function drawArt(cv,id){
 var r=cv.getBoundingClientRect();if(!r.width)return;var dp=Math.min(2,devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
 var c=cv.getContext("2d");c.scale(dp,dp);var w=r.width,h=r.height;
 var pal={breche:["#3A170C","#07080C","#FF7A3D"],bastion:["#2E3520","#12150D","#D2B04C"],mafia:["#4A231C","#120A09","#C9A15B"],studio:["#1F2A66","#080A16","#6E8BFF"]}[id];
 var gr=c.createLinearGradient(0,0,w*.4,h);gr.addColorStop(0,pal[0]);gr.addColorStop(1,pal[1]);c.fillStyle=gr;c.fillRect(0,0,w,h);
 c.strokeStyle=pal[2];c.lineWidth=1;
 if(id==="bastion"){for(var k=0;k<16;k++){c.globalAlpha=.1+.25*(k/16);c.beginPath();for(var x=0;x<=w;x+=6){var y=h*.25+k*h/26+Math.sin(x/50+k*.7)*14+Math.sin(x/19+k)*4;x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
 else if(id==="breche"){var cx=w*.5,pts=[[0,0],[-.05,.16],[.04,.27],[-.06,.42],[.05,.55],[-.03,.72],[.02,1]];var g2=c.createRadialGradient(cx,h*.42,4,cx,h*.42,h*.6);g2.addColorStop(0,"rgba(255,122,61,.45)");g2.addColorStop(1,"rgba(255,122,61,0)");c.fillStyle=g2;c.fillRect(0,0,w,h);c.save();c.shadowColor="#FF7A3D";c.shadowBlur=24;c.strokeStyle="#FFD2B0";c.lineWidth=3;c.lineJoin="round";c.beginPath();pts.forEach(function(p,i){var x=cx+p[0]*w*.5,y=h*.06+p[1]*h*.62;i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();c.restore();for(var q=0;q<70;q++){c.globalAlpha=Math.random()*.7;c.fillStyle=q%3?"#FF7A3D":"#FFE2C8";var an=Math.random()*6.28,rr=Math.random()*h*.45;c.fillRect(cx+Math.cos(an)*rr,h*.4+Math.sin(an)*rr,2,2)}c.globalAlpha=1;c.fillStyle="#07080C";c.fillRect(0,h*.78,w,h*.22);var sh2=c.createLinearGradient(0,h*.5,0,h);sh2.addColorStop(0,"rgba(0,0,0,0)");sh2.addColorStop(1,"rgba(0,0,0,.6)");c.fillStyle=sh2;c.fillRect(0,0,w,h);return}
 else if(id==="mafia"){for(var a=0;a<46;a++){c.globalAlpha=.06+(a%3===0?.18:.06);c.beginPath();c.moveTo(w*.5,h*1.05);c.lineTo(w*.5+Math.cos(Math.PI+a*.07)*h*1.5,h*1.05+Math.sin(Math.PI+a*.07)*h*1.5);c.stroke()}c.globalAlpha=.9;c.fillStyle=pal[2];c.beginPath();c.arc(w*.5,h*1.05,h*.28,Math.PI,0);c.globalAlpha=.12;c.fill()}
 else{var s=16;for(var i=0;i<w;i+=s)for(var j=0;j<h;j+=s){var d=Math.hypot(i-w*.75,j-h*.3)/Math.max(w,h);var p=Math.max(0,.7-d)*1.1;if(Math.random()<p){c.globalAlpha=Math.random()*.6*p+.05;c.fillStyle=pal[2];c.beginPath();c.roundRect?c.roundRect(i+2,j+2,s-4,s-4,3):c.rect(i+2,j+2,s-4,s-4);c.fill()}}}
 c.globalAlpha=1;
 var img=new Image();img.onload=function(){var z=Math.min(w,h)*.42;c.globalAlpha=.95;c.drawImage(img,w-z-18,h*.4,z,z);var sh=c.createLinearGradient(0,h*.45,0,h);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(0,0,0,.55)");c.globalAlpha=1;c.fillStyle=sh;c.fillRect(0,0,w,h)};
 img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(ICON[id].replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" ').replace(/<rect width="100" height="100" fill="[^"]+"\/>/,""));
}
function drawFeat(){document.querySelectorAll("canvas[data-art]").forEach(function(c){drawArt(c,c.dataset.art)})}

/* ---------- PUSHED PAGES (app detail, lists) ---------- */
var pages=[];
var BACKSVG='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4.5 7.5 12l7.5 7.5"/></svg>';
var SHARESVG='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
var STAR='<svg viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z"/></svg>';
function stars(n,cls){var h='<span class="stars '+(cls||"")+'">';for(var i=1;i<=5;i++)h+='<i class="'+(i<=n?"on":"")+'">'+STAR+'</i>';return h+'</span>'}
function backLabel(){return pages.length?(pages[pages.length-1].dataset.title||"Retour"):TABS.filter(function(t){return t[0]===stab})[0][1]}
function pushPage(html,title,cls){
 closeOverlay();
 var el=document.createElement("div");el.className="page "+(cls||"");el.dataset.title=title;
 el.innerHTML='<div class="pnav"><button class="pback" data-pback="1">'+BACKSVG+'<span>'+esc(backLabel())+'</span></button><div class="pmid"></div><div class="pright"></div></div><div class="pin">'+html+'</div>';
 var under=pages.length?pages[pages.length-1]:(stab==="island"?$("#isle"):$("#store"));
 document.body.appendChild(el);pages.push(el);document.documentElement.classList.add("paged");
 under.classList.add("under");
 requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add("in")})});
 el.addEventListener("scroll",function(){pageScroll(el)},{passive:true});
 edgeSwipe(el);
 el.querySelectorAll("canvas[data-art]").forEach(function(c){setTimeout(function(){drawArt(c,c.dataset.art)},30)});
 return el;
}
function pageScroll(el){
 var y=el.scrollTop;el.classList.toggle("scrolled",y>8);
 var hd=el.querySelector(".dhead");if(hd)el.classList.toggle("mini",y>hd.offsetTop+hd.offsetHeight-60);
 var lt=el.querySelector(".plt");if(lt)el.classList.toggle("mini",y>lt.offsetTop+30);
}
function popPage(instant){
 var el=pages.pop();if(!el)return;
 var under=pages.length?pages[pages.length-1]:(stab==="island"?$("#isle"):$("#store"));under.classList.remove("under");
 if(!pages.length)document.documentElement.classList.remove("paged");
 if(instant||REDUCE){el.remove();return}
 el.style.transition="";el.style.transform="";el.classList.remove("in");el.classList.add("out");
 setTimeout(function(){el.remove()},480);
 if(!pages.length&&stab!=="search")renderStoreSoft();
}
function closePages(){while(pages.length)popPage(true)}
function renderStoreSoft(){ // refresh rows (ratings / opens) without losing scroll
 if(stab==="island")return;
 var y=window.scrollY;renderStore();window.scrollTo(0,y);
}
function edgeSwipe(el){
 var x0=null,dx=0,y0=0,locked=false;
 el.addEventListener("touchstart",function(e){var t=e.touches[0];if(t.clientX<26){x0=t.clientX;y0=t.clientY;dx=0;locked=false}else x0=null},{passive:true});
 el.addEventListener("touchmove",function(e){if(x0===null)return;var t=e.touches[0];dx=Math.max(0,t.clientX-x0);if(!locked&&Math.abs(t.clientY-y0)>Math.abs(dx)+6){x0=null;return}locked=true;el.style.transition="none";el.style.transform="translateX("+dx+"px)"},{passive:true});
 el.addEventListener("touchend",function(){if(x0===null)return;x0=null;el.style.transition="";if(dx>innerWidth*.3)popPage();else el.style.transform=""});
}
function infoCell(top,mid,bot){return '<div class="ic2"><em>'+top+'</em><strong>'+mid+'</strong><small>'+bot+'</small></div>'}
function openApp(id){openDetail(id)}
function openDetail(id){
 var it=item(id),r=ratings()[id]||0,n=opens(id),sh=CAN_SHOTS&&SHOTS[id]?SHOTS[id]:0;
 var h='<header class="dhead">'+icn(id)+'<div class="dt"><h1>'+esc(it.name)+'</h1><p>'+esc(it.tag)+'</p><div class="dact">'+getBtn(id,"solid")+'<button class="share" data-share="'+id+'" aria-label="Partager">'+SHARESVG+'</button></div></div></header>';
 h+='<div class="istrip">'+infoCell("Ta note",r?r.toFixed(1).replace(".",","):"—",r?stars(r,"sm"):"Pas encore notée")+infoCell("Âge",AGE[id]||"4+","ans")+infoCell("Catégorie",'<span class="cg">'+esc(catName(it))+'</span>',esc(it.cat.split(" · ")[0]))+infoCell("Créateur",'<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7Z"/></svg>',"Seven")+infoCell("Langue","FR","Français")+infoCell("Ouvertures",String(n),n>1?"fois":"fois")+'</div>';
 if(NEWS[id])h+='<section class="dsec"><div class="sh2"><h2>Nouveautés</h2></div><div class="news"><small>Version 1.0 · '+NEWS[id][0]+'</small><p>'+NEWS[id][1]+'</p></div></section>';
 if(sh){h+='<section class="dsec"><div class="sh2"><h2>Aperçu</h2></div><div class="shots">';for(var i=1;i<=sh;i++)h+='<button class="shot" data-shot="'+id+'|'+i+'"><img loading="lazy" alt="Capture '+i+' de '+esc(it.name)+'" src="'+shot(id,i)+'"></button>';h+='</div><div class="dev2"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2.5" width="12" height="19" rx="3"/></svg>iPhone</div></section>'}
 h+='<section class="dsec"><div class="dsc"><p>'+esc(it.desc)+'</p><button class="more" data-more="1">plus</button></div><button class="devrow" data-cat="dev"><span><b>Seven</b><small>Créateur</small></span>'+CHEV+'</button></section>';
 h+='<section class="dsec"><div class="sh2"><h2>Notes et avis</h2></div><div class="rate"><div class="big"><b>'+(r?r.toFixed(1).replace(".",","):"–")+'</b><small>sur 5</small></div><div class="rbars">'+[5,4,3,2,1].map(function(k){return '<div><span>'+"★".repeat(k)+'</span><i><u style="width:'+(r===k?100:0)+'%"></u></i></div>'}).join("")+'<small>'+(r?"Ta note":"Aucune note pour l'instant")+'</small></div></div><div class="tap"><span>Touche pour noter :</span><span class="stars big" data-rate="'+id+'">'+[1,2,3,4,5].map(function(k){return '<button data-star="'+k+'" class="'+(k<=r?"on":"")+'" aria-label="'+k+' étoile'+(k>1?"s":"")+'">'+STAR+'</button>'}).join("")+'</span></div></section>';
 h+='<section class="dsec"><div class="sh2"><h2>Informations</h2></div><div class="infos">'+[["Créateur","Seven"],["Catégorie",esc(it.cat)],["Compatibilité","iPhone, iPad et ordinateur"],["Langue","Français"],["Âge",(AGE[id]||"4+")],["Prix","Gratuit"],["Où elle vit",it.tycoon?"Dans Pop":it.live?"En ligne":"Incluse dans Pop"]].map(function(x){return '<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join("")+'</div>'+(it.tycoon?"":'<p class="tip">'+(it.live?"Astuce : dans Safari, Partager puis « Sur l'écran d'accueil » pour l'avoir comme une vraie appli.":"Elle s'ouvre directement depuis Pop.")+'</p>')+'</section>';
 var like=allIds().filter(function(x){return x!==id&&(item(x).game===it.game)}).slice(0,9);
 h+='<section class="dsec"><div class="sh2"><h2>Tu aimeras aussi</h2></div><div class="hs rows3">'+like.map(function(x){return arow(x)}).join("")+'</div></section>';
 var el=pushPage(h,it.name,"detail");
 el.querySelector(".pmid").innerHTML=icn(id);el.querySelector(".pright").innerHTML=getBtn(id,"solid sm");
 var d=el.querySelector(".dsc");if(d&&d.scrollHeight<=d.clientHeight+2)d.classList.add("full");
}
function openList(key){
 var title,ids,lead="";
 if(key==="apps"){title="Tes indispensables";ids=APPS.filter(function(a){return GAME_APPS.indexOf(a.id)<0}).map(function(a){return a.id})}
 else if(key==="topapps"){title="Top Apps";ids=ranked(APPS.filter(function(a){return GAME_APPS.indexOf(a.id)<0}).map(function(a){return a.id}))}
 else if(key==="topgames"){title="Top Jeux";ids=ranked(GAME_APPS.concat(GIDS))}
 else if(key==="dev"){title="Seven";ids=allIds();lead="Toutes les créations de Seven."}
 else{var c=CATS[+key];title=c[0];ids=c[2]}
 var num=/^top/.test(key);
 pushPage('<h1 class="plt">'+title+'</h1>'+(lead?'<p class="plead">'+lead+'</p>':"")+'<div class="groupcard plain">'+ids.map(function(id,i){return arow(id,num?i+1:0)}).join("")+'</div>',title,"list");
}

/* ---------- TODAY STORY (card expands to full screen) ---------- */
var storyEl=null;
function storyBody(key){
 var st=STORY[key],h='<div class="sbody">';
 if(st.lead)h+='<p class="lead">'+st.lead+'</p>';
 if(st.list){h+='<div class="groupcard plain">'+st.all.map(function(id){return arow(id)}).join("")+'</div>'}
 else{
  (st.body||[]).forEach(function(p){
   if(p.charAt(0)==="@"){var m=p.slice(1).split("-");if(CAN_SHOTS&&SHOTS[m[0]]&&SHOTS[m[0]]>=+m[1])h+='<figure class="sfig"><button class="shot" data-shot="'+m[0]+'|'+m[1]+'"><img loading="lazy" alt="" src="'+shot(m[0],m[1])+'"></button></figure>';}
   else h+='<p>'+p+'</p>';
  });
  var it=item(st.app);
  h+='<div class="sapp">'+icn(st.app)+'<b>'+esc(it.name)+'</b><small>'+esc(it.tag)+'</small>'+getBtn(st.app,"solid")+'<button class="link" data-detail="'+st.app+'">Voir la fiche</button></div>';
 }
 h+='<button class="sshare" data-share="story">'+SHARESVG+'Partager l\'histoire</button></div>';
 return h;
}
function openStory(card){
 if(storyEl)return;
 var key=card.dataset.story,r=card.getBoundingClientRect();
 var ov=document.createElement("div");ov.className="story";
 var hero=card.cloneNode(true);hero.classList.remove("press");hero.classList.add("shero");hero.removeAttribute("data-story");hero.removeAttribute("role");hero.removeAttribute("tabindex");
 var oc=card.querySelectorAll("canvas"),nc=hero.querySelectorAll("canvas");
 nc.forEach(function(c,i){c.removeAttribute("data-art");c.width=oc[i].width;c.height=oc[i].height;c.getContext("2d").drawImage(oc[i],0,0)});
 ov.innerHTML='<div class="sdim"></div><div class="sbox"><div class="sscroll"></div></div><button class="sclose" data-sclose="1" aria-label="Fermer">'+XSVG+'</button>';
 var box=ov.querySelector(".sbox"),sc=ov.querySelector(".sscroll");
 hero.style.height=(card.classList.contains("list")?"auto":r.height+"px");
 sc.appendChild(hero);sc.insertAdjacentHTML("beforeend",storyBody(key));
 if(card.classList.contains("list"))hero.querySelector(".rows").remove();
 document.body.appendChild(ov);storyEl={ov:ov,card:card,box:box};
 document.documentElement.classList.add("storied");card.style.visibility="hidden";
 var W=innerWidth,H=innerHeight;
 var from={top:r.top+"px",left:r.left+"px",width:r.width+"px",height:r.height+"px",borderRadius:"20px"},to={top:"0px",left:"0px",width:W+"px",height:H+"px",borderRadius:"0px"};
 Object.assign(box.style,to);
 if(!REDUCE&&box.animate){box.animate([from,to],{duration:620,easing:SPRING});}
 ov.classList.add("open");
 storyDrag(ov,sc,box);
}
function closeStory(){
 if(!storyEl)return;var s=storyEl;storyEl=null;
 var r=s.card.getBoundingClientRect(),box=s.box;
 s.ov.classList.remove("open");s.ov.classList.add("closing");
 var sc=s.ov.querySelector(".sscroll");
 var cur0={top:box.style.top,left:box.style.left,width:box.style.width,height:box.style.height,borderRadius:box.style.borderRadius,transform:box.style.transform||"none"};
 var to={top:r.top+"px",left:r.left+"px",width:r.width+"px",height:r.height+"px",borderRadius:"20px",transform:"none"};
 var done=function(){s.card.style.visibility="";s.ov.remove();document.documentElement.classList.remove("storied")};
 if(REDUCE||!box.animate){done();return}
 sc.style.overflow="hidden";var y=sc.scrollTop;sc.scrollTop=0;if(y)sc.firstChild.style.marginTop="0";
 var a=box.animate([cur0,to],{duration:520,easing:SPRING,fill:"forwards"});a.onfinish=done;setTimeout(done,900);
}
function storyDrag(ov,sc,box){
 var y0=null,dy=0;
 sc.addEventListener("touchstart",function(e){if(sc.scrollTop<=0){y0=e.touches[0].clientY;dy=0}else y0=null},{passive:true});
 sc.addEventListener("touchmove",function(e){if(y0===null)return;dy=e.touches[0].clientY-y0;if(dy<=0){box.style.transform="";return}var s=Math.max(.82,1-dy/1100);box.style.transition="none";box.style.transform="scale("+s+")";box.style.borderRadius=Math.min(28,dy/4)+"px"},{passive:true});
 sc.addEventListener("touchend",function(){if(y0===null)return;y0=null;if(dy>110)closeStory();else{box.style.transition="transform .45s "+SPRING+",border-radius .45s";box.style.transform="";box.style.borderRadius="0px"}});
}

/* ---------- SCREENSHOT VIEWER ---------- */
function openShots(id,i){
 var n=SHOTS[id],h='<div class="lb"><div class="lbbar"><button data-lbclose="1">OK</button><b>'+esc(item(id).name)+'</b><span></span></div><div class="lbs">';
 for(var k=1;k<=n;k++)h+='<div><img alt="" src="'+shot(id,k)+'"></div>';
 h+='</div></div>';
 document.body.insertAdjacentHTML("beforeend",h);
 var s=document.querySelector(".lb .lbs");s.scrollLeft=(i-1)*s.clientWidth;
}

/* ---------- EVENTS ---------- */
document.addEventListener("click",function(e){
 var t=e.target;
 var sb=t.closest("[data-stab]");
 if(sb){var n=sb.dataset.stab;if(n===stab){if(pages.length){closePages();return}window.scrollTo({top:0,behavior:"smooth"});return}closeStory();closePages();stab=n;try{localStorage.setItem("pop.tab",n)}catch(err){}editMode=false;window.scrollTo(0,0);renderStore();return}
 if(t.closest("[data-lbclose]")){var lb=t.closest(".lb");lb.classList.add("out");setTimeout(function(){lb.remove()},250);return}
 if(t.closest("[data-sclose]")){closeStory();return}
 if(t.closest("[data-pback]")){popPage();return}
 if(t.closest(".pill")){if(storyEl&&t.closest(".pill").dataset.game)closeStory(true);if(t.closest(".pill").dataset.game)closePages();return}
 var x;
 if(x=t.closest("[data-star]")){var id=x.parentNode.dataset.rate,k=+x.dataset.star,rr=ratings();rr[id]=k;store.set("lima.ratings",rr);x.parentNode.querySelectorAll("button").forEach(function(b){b.classList.toggle("on",+b.dataset.star<=k);b.classList.remove("pop")});void x.offsetWidth;x.classList.add("pop");var pg=x.closest(".page");if(pg){var big=pg.querySelector(".rate .big b");if(big)big.textContent=k.toFixed(1).replace(".",",");pg.querySelectorAll(".rbars u").forEach(function(u,j){u.style.width=(5-j===k?100:0)+"%"});var lab=pg.querySelector(".rbars small");if(lab)lab.textContent="Ta note";var c=pg.querySelector(".istrip .ic2");if(c)c.outerHTML=infoCell("Ta note",k.toFixed(1).replace(".",","),stars(k,"sm"))}return}
 if(x=t.closest("[data-shot]")){var p=x.dataset.shot.split("|");openShots(p[0],+p[1]);return}
 if(x=t.closest("[data-more]")){x.parentNode.classList.add("full");return}
 if(x=t.closest("[data-share]")){var v=x.dataset.share,data={title:"Pop",url:location.href.split("#")[0]};if(v!=="story"){data.title=item(v).name;data.text=item(v).tag}try{if(navigator.share)navigator.share(data).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(data.url)}catch(err){}return}
 if(x=t.closest("[data-list]")){openList(x.dataset.list);return}
 if(x=t.closest("[data-cat]")){openList(x.dataset.cat);return}
 if(x=t.closest("[data-q]")){openSearch();var q=$("#spq");q.value=x.dataset.q;renderSearch(q.value);return}
 if(x=t.closest("[data-detail]")){if(storyEl){var id2=x.dataset.detail;closeStory();setTimeout(function(){openDetail(id2)},200)}else openDetail(x.dataset.detail);return}
 if(x=t.closest("[data-story]")){openStory(x);return}
});
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"){if(document.querySelector(".lb")){document.querySelector(".lb").remove();return}if(storyEl){closeStory();return}if(pages.length){popPage();return}}
 if((e.key==="Enter"||e.key===" ")&&e.target.matches&&e.target.matches('[role="button"]')){e.preventDefault();e.target.click()}
});

/* ---------- OVERLAYS ---------- */
function closeOverlay(){$("#overlay").innerHTML=""}
function openFolder(){
 $("#overlay").innerHTML='<div class="scrim blur" data-close="1"><div class="fold"><h4>Tycoon & RPG</h4><div class="box">'+GIDS.map(function(id){return '<button class="app" data-game="'+id+'">'+icn(id)+'<b>'+GAMES[id].name+'</b></button>'}).join("")+'<button class="app" data-app="breche">'+icn("breche")+'<b>Brèche</b></button></div></div></div>';
}
