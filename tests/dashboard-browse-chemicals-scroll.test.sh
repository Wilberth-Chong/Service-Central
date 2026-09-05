#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'scrollTarget: ".cons-chemicals"' app.js
rg -Fq 'function openDashboardPromotion(promotion)' app.js
rg -Fq 'openDashboardPromotion(DASHBOARD_PROMOTIONS[promotionIndex])' app.js
rg -Fq 'const pageScroller = target.closest(".platform-page-body")' app.js
rg -Fq 'pageScroller.scrollTop + target.getBoundingClientRect().top - pageScroller.getBoundingClientRect().top' app.js
printf 'PASS: Browse chemicals routes to Consumables and scrolls to Chemicals\n'
