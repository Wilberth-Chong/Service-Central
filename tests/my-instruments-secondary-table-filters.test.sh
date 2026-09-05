#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
app_file="$root_dir/app.js"
styles_file="$root_dir/styles.css"

for label in \
  'Favorite instrument filters' \
  'Shared instrument filters' \
  'Support history suggestion filters' \
  'Installation invite filters'; do
  grep -Fq "$label" "$app_file"
done

grep -Fq 'function wireMiSecondaryTableFilters(panel)' "$app_file"
grep -Fq 'function applyMiSecondaryTableFilters(panel)' "$app_file"
grep -Fq 'multiselect-filter-sort' "$app_file"
grep -Fq '[data-mi-secondary-filter-trigger] .msf__trigger' "$styles_file"

echo "Favorite, Shared with me, Support history, and Installation invites use functional table filters."
