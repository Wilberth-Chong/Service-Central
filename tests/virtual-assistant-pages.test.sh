#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
index="$root/index.html"
app="$root/app.js"
styles="$root/styles.css"

# Dashboard has its own control; static and rendered routes share the requested treatment.
test "$(rg -o 'data-virtual-assistant' "$index" | wc -l | tr -d ' ')" -eq 7
test "$(rg -o 'data-virtual-assistant' "$app" | wc -l | tr -d ' ')" -ge 4
rg -Fq 'data-virtual-assistant-separator' "$index"
rg -Fq 'data-virtual-assistant-separator' "$app"
rg -Fq 'function shouldHideVirtualAssistant()' "$app"
rg -Fq 'return isEuropeLePrototype() || isUnmappedPrototypeUser();' "$app"
rg -Fq '.platform-virtual-assistant' "$styles"
rg -Fq '[data-virtual-assistant][hidden], [data-dashboard-virtual-assistant][hidden], [data-virtual-assistant-separator][hidden] { display: none !important; }' "$styles"
rg -Fq '.mi-shell .platform-virtual-assistant { color: #6058df !important; }' "$styles"
rg -Fq '.id-hero__actions .platform-virtual-assistant, .sd-actions .platform-virtual-assistant { height: 30px; }' "$styles"
rg -Fq '.iss-main.is-platform-titlebar-compact .platform-virtual-assistant { height: 30px; min-width: 0; }' "$styles"
rg -Fq '.isd-main.is-platform-titlebar-compact .platform-virtual-assistant { height: 30px; min-width: 0; }' "$styles"
rg -Fq '.mi-titlebar__actions' "$styles"
rg -Fq '.iss-titlebar__actions' "$styles"

echo 'Virtual assistant title-bar controls are wired.'
