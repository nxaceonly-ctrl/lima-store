#!/bin/sh
# Builds lima.html: parts/store.css (head + store CSS) + parts/game.css + ICON/APPS from parts/lima-v1.html + games.js + storeui.js + shell2.js
set -e
cd "$(dirname "$0")"
f=parts/lima-v1.html
end=$(grep -n "TYCOON DEFINITIONS" $f | cut -d: -f1)
{ cat parts/store.css parts/game.css; sed -n "163,$((end-1))p" $f; cat parts/games.js parts/storeui.js parts/shell2.js; } > lima.html
