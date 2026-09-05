#!/usr/bin/env bash
set -euo pipefail

css="styles.css"
html="index.html"

for token in \
  '--komodo-secondary-button-bg: #54545c;' \
  '--komodo-secondary-button-bg-hover: #1b1b1d;' \
  '--komodo-secondary-button-label: #fff;' \
  '--komodo-secondary-button-disabled-bg: #e5e5e5;' \
  '--komodo-secondary-button-disabled-label: #92929e;' \
  '--komodo-secondary-button-focus: #802eff;'
do
  rg -Fq -- "$token" "$css"
done

for selector in '.komodo-button--secondary,' '.mi-shell .ins-support,' '.mi-secondary-content .mi-secondary-share,' '.ai-bulk-review-all,' '.sd-users-panel > header > button'
do
  rg -Fq "$selector" "$css"
done

rg -Fq 'height: 32px !important;' "$css"
rg -Fq 'height: 40px !important;' "$css"
rg -Fq 'height: 48px !important;' "$css"
rg -Fq 'class="mi-button ins-support" type="button" data-route="installation-support">Installation support</button>' "$html"
test "$(rg -Fc ':not(.ins-support)' "$css")" -ge 6
test "$(rg -Fc ':not(.mi-secondary-share)' "$css")" -ge 6
rg -Fq 'class="mi-button mi-secondary-share" type="button" data-mi-toast="Share users opened">Share</button>' app.js

echo "Komodo secondary button checks passed."
