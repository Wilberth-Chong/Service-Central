#!/usr/bin/env bash
set -euo pipefail

css="styles.css"
html="index.html"
js="app.js"

rg -Fq '.is-platform-titlebar-compact > [data-platform-titlebar] :is(' "$css"
rg -Fq '.mi-button--primary,' "$css"
rg -Fq '.sd-primary' "$css"
rg -Fq ')[data-route="request-support"] {' "$css"
rg -Fq 'height: 32px !important;' "$css"
rg -Fq 'min-height: 32px !important;' "$css"
rg -Fq 'padding-right: 16px !important;' "$css"
rg -Fq 'padding-left: 16px !important;' "$css"
rg -Fq '[data-platform-titlebar] :is(' "$css"
rg -Fq '[data-virtual-assistant],' "$css"
rg -Fq '[data-dashboard-virtual-assistant]' "$css"
rg -Fq '.iss-titlebar,' "$css"
rg -Fq '.isd-titlebar' "$css"
rg -Fq '.is-platform-titlebar-compact > .sd-hero .sd-actions > .platform-virtual-assistant { min-width: 0; padding: 0 16px !important; }' "$css"
rg -Fq '.id-hero .mi-button--primary[data-route="request-support"] {' "$css"
rg -Fq 'width: 180px;' "$css"

test "$(rg -Fc 'data-route="request-support">Start a request</button>' "$html")" -ge 3
rg -Fq 'class="sd-primary" type="button" data-route="request-support">Start a request</button>' "$js"
rg -Fq 'class="mi-button mi-button--primary" type="button" data-route="request-support">Start a request</button>' "$js"

echo "Compact Start a request button checks passed."
