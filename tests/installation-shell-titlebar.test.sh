#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'class="shell-detail-hero" data-platform-titlebar' "$repo_dir/index.html"
grep -Fq '.shell-detail-hero[data-platform-titlebar] { transition: none; }' "$repo_dir/styles.css"
grep -Fq '.screen--installation-shell-detail .shell-detail-main::after {' "$repo_dir/styles.css"
grep -Fq 'height: 272px;' "$repo_dir/styles.css"

echo "Installation shell titlebar transition test passed."
