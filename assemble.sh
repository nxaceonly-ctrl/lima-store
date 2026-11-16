#!/bin/sh
# Builds lima.html from parts: store CSS + ICON/APPS from parts/lima-v1.html, games + shell from parts/.
set -e
cd "$(dirname "$0")"
f=parts/lima-v1.html
end=$(grep -n "TYCOON DEFINITIONS" $f | cut -d: -f1)
{ sed -n '1,80p' $f; cat parts/game.css; sed -n "163,$((end-1))p" $f; cat parts/games.js parts/shell.js; } > lima.html
