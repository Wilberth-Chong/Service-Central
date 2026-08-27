#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'const parentNavigation = instrumentDetailParentNavigation();' "$repo_dir/app.js"
grep -Fq 'class="sd-parent-navigation"' "$repo_dir/app.js"
grep -Fq 'data-sd-nickname' "$repo_dir/app.js"
grep -Fq '.sd-parent-navigation {' "$repo_dir/styles.css"
grep -Fq '.is-platform-titlebar-compact > .sd-hero .sd-parent-navigation' "$repo_dir/styles.css"
grep -Fq '.is-platform-titlebar-compact > .sd-hero [data-sd-nickname] { display: none; }' "$repo_dir/styles.css"
grep -Fq '.sd-action-menu-wrap > button img { filter: brightness(0) saturate(100%) invert(35%) sepia(74%) saturate(1351%) hue-rotate(174deg) brightness(91%) contrast(102%); }' "$repo_dir/styles.css"
grep -Fq '.sd-actions .sd-primary { width: 180px; border-color: #e71316; color: #fff; background: #e71316; white-space: nowrap; }' "$repo_dir/styles.css"

echo "System detail parent navigation test passed."
