#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
index="$root/index.html"
app="$root/app.js"

for filter in groups type model coverage; do
  rg -q "data-mi-filter-trigger=\"$filter\"" "$index"
  rg -q "data-mi-grid-filter-trigger=\"$filter\"" "$index"
done
rg -q 'data-mi-applied-filters' "$index"
rg -q 'data-mi-clear-filters' "$index"

mi_wire="$(sed -n '/^function wireMyInstruments()/,/^function renderMyInstruments()/p' "$app")"
printf '%s' "$mi_wire" | rg -q 'new window.MultiSelectFilter'
printf '%s' "$mi_wire" | rg -q 'data-mi-applied-filters'
printf '%s' "$mi_wire" | rg -q 'data-mi-clear-filters'
printf '%s' "$mi_wire" | rg -q 'candidate.dataset\[key\]'
printf '%s' "$mi_wire" | rg -q 'miGridFilters'
printf '%s' "$mi_wire" | rg -q 'data-mi-grid-filter-trigger'

rg -q '\.mi-table \[data-mi-filter-trigger="groups"\] \.msf__menu' "$root/styles.css"
rg -q '\.mi-table \[data-mi-filter-trigger="model"\] \.msf__menu' "$root/styles.css"
rg -q 'width: max-content' "$root/styles.css"
rg -q 'min-width: 20px' "$root/styles.css"
rg -q '\.mi-table \[data-mi-filter-trigger="type"\] \.msf__menu' "$root/styles.css"
rg -q 'overflow-x: hidden' "$root/styles.css"
rg -Fq '.mi-table th:has(.msf__menu:not([hidden]))' "$root/styles.css"
rg -Fq '.mi-applied-filters { display: flex; width: 100%; flex-wrap: wrap; align-items: center;' "$root/styles.css"
rg -Fq '.mi-applied-filters { margin-left: 0; }' "$root/styles.css"
rg -Fq '.mi-applied-filters > .msf--applied-host:not(:has(.msf__applied:not([hidden]))) { display: none; }' "$root/styles.css"
rg -Fq '.mi-applied-filters [data-mi-clear-filters] { align-self: center;' "$root/styles.css"
rg -Fq '.sh-applied-filters.mi-applied-filters [data-mi-clear-filters] { margin-top: 0;' "$root/styles.css"

# The table's permanent visual identifiers cannot be removed from Edit columns.
rg -Fq 'checked disabled data-mi-column="instrument-images" aria-label="Instrument images are always displayed"' "$index"
rg -Fq 'table.classList.toggle("mi-table--dynamic-columns"' "$app"
rg -Fq '.mi-table.mi-table--dynamic-columns col[data-mi-table-column]:not([data-mi-table-column="instrument-images"]) { width: auto; }' "$root/styles.css"

# System parents and their expanded component rows honor the same column preferences.
rg -Fq '<td data-mi-table-column="nickname">${system.nickname}</td>' "$app"
rg -Fq '<td data-mi-table-column="groups">${instrument.group}</td>' "$app"
rg -Fq '<td data-mi-table-column="coverage-end">${instrument.end}</td>' "$app"

# Reduced-column tables share the available width without allowing content to expand the table.
rg -Fq '.mi-table.mi-table--dynamic-columns { table-layout: fixed; }' "$root/styles.css"
rg -Fq '.mi-col-actions { width: 70px; }' "$root/styles.css"
rg -Fq '.mi-table.mi-table--dynamic-columns td[data-mi-table-column] > .mi-ellipsis,' "$root/styles.css"

echo 'My Instruments table filters are wired.'
