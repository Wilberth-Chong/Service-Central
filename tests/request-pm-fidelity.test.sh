#!/usr/bin/env bash
set -euo pipefail

# Regression: PM's five-step frame, promo, and applied-filter clear action
# retain their Figma-specific placement without changing Qualification.
rg -Fq '.screen--request-pm .iss-steps--five' styles.css
rg -Fq '.screen--request-pm .pm-promo' styles.css
rg -Fq '.screen--request-pm .qualification-select-all' styles.css
rg -Fq '.screen--request-pm .msf__menu--figma-column .msf__clear-menu' styles.css
rg -Fq '.screen--request-pm .iss-steps--five li:nth-child(4)' styles.css
rg -Fq '.screen--request-pm .pm-card { width: 1200px;' styles.css
rg -Fq '.screen--request-pm .pm-promo button img { filter:' styles.css
rg -Fq 'promo.dataset.pmPromoIndex' app.js
rg -Fq 'table.className = "iss-table pm-selection-table"' app.js
