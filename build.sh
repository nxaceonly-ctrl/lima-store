#!/bin/sh
# Rebuilds site/ from lima.html (artifact source) + other apps' artifact sources.
set -e
cd "$(dirname "$0")"
HEAD_RESET='<style>*,*::before,*::after{box-sizing:border-box}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,-apple-system,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>'
wrap(){ # $1 src $2 out $3 title $4 color
 { echo '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
   echo "<meta name=\"theme-color\" content=\"$4\"><meta name=\"apple-mobile-web-app-capable\" content=\"yes\"><meta name=\"mobile-web-app-capable\" content=\"yes\"><meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\"><meta name=\"apple-mobile-web-app-title\" content=\"$3\">"
   [ -n "$5" ] && echo "$5"
   echo "$HEAD_RESET</head><body>"; cat "$1"; echo '</body></html>'; } > "$2"
}
POPBUILD=$(date +%s)
# Auto-update: the home-screen app can show a cached page for ~10 min after a deploy; this fetches the fresh page and reloads once if the build changed.
POPUPD='<script>(function(){var m=document.querySelector("meta[name=pop-build]");if(!m||!window.fetch)return;function chk(){fetch(location.pathname+"?nocache="+Date.now(),{cache:"no-store"}).then(function(r){return r.text()}).then(function(t){var x=t.match(/name="pop-build" content="(\d+)"/);if(!x||x[1]===m.content)return;try{if(sessionStorage.getItem("pop.upd")===x[1])return;sessionStorage.setItem("pop.upd",x[1])}catch(e){}location.replace(location.pathname+"?b="+x[1]+location.hash)}).catch(function(){})}chk();document.addEventListener("visibilitychange",function(){if(!document.hidden)chk()})})();</script>'
wrap lima.html site/index.html "Pop" "#F5F5F7" "<meta name=\"pop-build\" content=\"$POPBUILD\"><link rel=\"manifest\" href=\"manifest.json\"><link rel=\"apple-touch-icon\" href=\"apple-touch-icon.png?v=5\"><link rel=\"icon\" href=\"favicon.png?v=5\">$POPUPD"
wrap ../qg/qg.html site/apps/qg.html "QG" "#2A2D2F"
wrap ../relais/relais.html site/apps/champion.html "Champion" "#0F0D12"
wrap ../frequence/frequence.html site/apps/frequence.html "Fréquence" "#0D1410"
wrap volta/volta.html site/apps/volta.html "Volta" "#0B0B0F"
wrap ../ciel/ciel.html site/apps/ciel.html "Ciel" "#243A6B"
wrap breche/breche.html site/apps/breche.html "Brèche" "#07080C"
wrap halo/halo.html site/apps/halo.html "Halo" "#000000" '<link rel="apple-touch-icon" href="../halo-icon.png"><link rel="icon" href="../halo-icon.png">'
