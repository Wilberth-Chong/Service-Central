#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
index="$root/index.html"
app="$root/app.js"
styles="$root/styles.css"

rg -Fq 'data-dashboard-virtual-assistant' "$index"
rg -Fq 'assets/icons/assistant-icon.svg' "$index"
test -f "$root/assets/icons/assistant-icon.svg"
rg -Fq 'isEuropeLePrototype()' "$app"
rg -Fq 'data-dashboard-virtual-assistant' "$app"
rg -Fq '.db-titlebar__assistant' "$styles"
rg -Fq '.is-platform-titlebar-compact > .db-titlebar .db-titlebar__assistant' "$styles"

echo 'Dashboard virtual assistant is wired.'
