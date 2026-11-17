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
wrap lima.html site/index.html "Pop" "#F5F5F7" '<link rel="manifest" href="manifest.json"><link rel="apple-touch-icon" href="apple-touch-icon.png?v=5"><link rel="icon" href="favicon.png?v=5">'
wrap ../qg/qg.html site/apps/qg.html "QG" "#2A2D2F"
wrap ../relais/relais.html site/apps/champion.html "Champion" "#0F0D12"
wrap ../frequence/frequence.html site/apps/frequence.html "Fréquence" "#0D1410"
wrap volta/volta.html site/apps/volta.html "Volta" "#0B0B0F"
wrap ../ciel/ciel.html site/apps/ciel.html "Ciel" "#243A6B"
wrap breche/breche.html site/apps/breche.html "Brèche" "#07080C"
