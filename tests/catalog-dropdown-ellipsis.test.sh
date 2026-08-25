#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

enhanced_count="$(rg -o -i '<button[^>]*platform-table-catalog-filter[^>]*><span class="platform-table-catalog-filter__label"[^>]*>Catalog no\.</span>' app.js index.html | wc -l | tr -d ' ' || true)"

if [[ "$enhanced_count" != "9" ]]; then
  echo "Expected 9 enhanced Catalog no. table dropdowns; found ${enhanced_count}." >&2
  exit 1
fi

if rg -n -i '<button[^>]*>Catalog no\.' app.js index.html; then
  echo "An unwrapped Catalog no. table dropdown remains." >&2
  exit 1
fi

rg -q '\.platform-table-catalog-filter__label[^}]*overflow: hidden' styles.css
rg -q '\.platform-table-catalog-filter__label[^}]*text-overflow: ellipsis' styles.css
rg -q '\.platform-table-catalog-filter__label[^}]*white-space: nowrap' styles.css
rg -q '\.platform-table-catalog-filter > img[^}]*flex: 0 0 auto' styles.css

echo "Catalog no. table dropdowns truncate consistently."
