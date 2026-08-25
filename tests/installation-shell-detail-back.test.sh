#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'class="shell-detail-back" type="button" data-shell-back' "$repo_dir/index.html"
grep -Fq 'assets/icons/directions/arrow left/size=16px, style=mono.svg' "$repo_dir/index.html"
grep -Fq 'data-go-back], [data-shell-back]' "$repo_dir/app.js"
grep -F '.shell-detail-back {' "$repo_dir/styles.css" | grep -Fq 'gap: 8px;'
grep -F '.shell-detail-back {' "$repo_dir/styles.css" | grep -Fq 'color: #0071d0 !important;'
grep -Fq '.shell-detail-back:hover, .shell-detail-back:focus, .shell-detail-back:active { color: #0071d0 !important; }' "$repo_dir/styles.css"
grep -F '.shell-detail-back::before {' "$repo_dir/styles.css" | grep -Fq 'background: #0071d0;'

echo "Installation shell detail back-navigation test passed."
