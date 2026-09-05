#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

test -f assets/dashboard/related-systems-suggestion.png
rg -Fq 'image: "assets/dashboard/related-systems-suggestion.png"' app.js
rg -Fq '.ai-banner__art > img[src$="related-systems-suggestion.png"] { top: 0; left: 0; width: 96px; height: 96px; }' styles.css
if rg -Fq 'image: "assets/dashboard/related-systems-suggestion.svg"' app.js; then
  printf 'FAIL: related-systems banner still references the previous illustration\n' >&2
  exit 1
fi
printf 'PASS: Dashboard and Add instruments share the exported Figma related-systems illustration\n'
