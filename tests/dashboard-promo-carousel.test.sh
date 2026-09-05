#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'const DASHBOARD_PROMOTIONS = [' app.js
rg -Fq 'Save up to 35% on <strong>eLearning</strong> courses' app.js
rg -Fq 'Maximize instrument uptime with <strong>preventive care</strong>' app.js
rg -Fq 'data-db-promo-prev' index.html
rg -Fq 'data-db-promo-next' index.html
rg -Fq 'data-db-promo-action' index.html
rg -Fq 'const updatePromotion = () =>' app.js
rg -Fq 'promotionIndex = (promotionIndex + 1) % DASHBOARD_PROMOTIONS.length;' app.js
rg -Fq '.db-promo__content' styles.css
rg -Fq 'font-size: 30px' styles.css
printf 'PASS: dashboard promotion carousel renders and routes all four Figma promotions\n'
