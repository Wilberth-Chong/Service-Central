#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
app="$repo_dir/app.js"
html="$repo_dir/index.html"
styles="$repo_dir/styles.css"

grep -Fq 'class="spc-segmented" role="group" aria-label="Instrument contact filter"' "$html"
grep -Fq 'data-spc-filter aria-pressed="true">All</button>' "$html"
grep -Fq 'filter.setAttribute("aria-pressed", "false")' "$app"
grep -Fq 'button.setAttribute("aria-pressed", "true")' "$app"
grep -Fq 'data-mi-segment="${key}" aria-pressed="${key === selectedKey}"' "$app"
grep -Fq '.mi-segmented { display: flex; height: 40px;' "$styles"
grep -Fq '.mi-segmented button { display: flex; height: 32px;' "$styles"
grep -Fq '.spc-segmented button {' "$styles"
grep -Fq 'width: max-content;' "$styles"
grep -Fq 'min-width: 0;' "$styles"
grep -Fq 'gap: 8px;' "$styles"
grep -Fq 'padding: 0 12px;' "$styles"
grep -Fq 'font-weight: 500;' "$styles"
grep -Fq '.spc-segmented button:disabled {' "$styles"
grep -Fq '.mi-segmented button:disabled {' "$styles"

echo "Segmented controls follow the Komodo dimensions, states, and selection semantics."
