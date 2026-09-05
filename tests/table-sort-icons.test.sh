#!/usr/bin/env bash
set -euo pipefail

js="app.js"
css="styles.css"
html="index.html"

rg -Fq 'const TABLE_SORT_ICON_SRC = "assets/icons/actions/arrows/Size=16px, Style=Bold.svg";' "$js"
rg -Fq 'function standardizeTableSortIcons(scope = document)' "$js"
rg -Fq 'table thead img[src*="assets/icons/actions/arrows/Size=16px"]' "$js"
rg -Fq 'standardizeTableSortIcons(scope);' "$js"
rg -Fq 'standardizeTableSortIcons(document);' "$js"
rg -Fq '.table-sort-icon { width: 16px; height: 16px; filter: brightness(0) saturate(100%) invert(80%) !important; }' "$css"
rg -Fq 'styles.css?v=20260904-komodo-compliance-v17' "$html"
rg -Fq 'app.js?v=20260904-komodo-compliance-v6' "$html"

echo "Table sort icon checks passed."
