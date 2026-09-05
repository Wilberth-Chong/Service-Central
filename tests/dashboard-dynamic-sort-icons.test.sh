#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'const DASHBOARD_SORT_ICON = `<img class="table-sort-icon" src="${TABLE_SORT_ICON_SRC}" alt="" />`;' app.js
rg -Fq 'function renderDashboardClosedTicketTable()' app.js
rg -Fq 'function renderDashboardVisitsTable()' app.js
rg -Fq '.table-sort-icon { width: 16px; height: 16px; filter: brightness(0) saturate(100%) invert(80%) !important; }' styles.css
printf 'PASS: dynamic Dashboard tables use the shared bold gray sorting icon\n'
