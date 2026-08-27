#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'function instrumentDetailParentNavigation()' "$repo_dir/app.js"
grep -Fq 'data-id-parent-navigation' "$repo_dir/app.js"
grep -Fq 'assets/icons/directions/arrow left/size=16px, style=mono.svg' "$repo_dir/app.js"
grep -Fq 'function instrumentDetailParentLabel(route)' "$repo_dir/app.js"
grep -Fq '.id-parent-navigation {' "$repo_dir/styles.css"
grep -Fq '.is-platform-titlebar-compact > .id-hero .id-parent-navigation' "$repo_dir/styles.css"
grep -Fq '.id-parent-navigation { position: absolute; z-index: 3; top: 40px; left: 48px;' "$repo_dir/styles.css"
grep -F '.id-parent-navigation {' "$repo_dir/styles.css" | grep -F 'color: #0071d0 !important;' | grep -Fq 'font-size: 14px; font-weight: 700 !important;'
grep -Fq '.id-parent-navigation:hover, .id-parent-navigation:focus-visible { text-decoration: none; }' "$repo_dir/styles.css"
grep -Fq '.id-hero[data-platform-titlebar] { transition: none; }' "$repo_dir/styles.css"
grep -Fq '.id-hero__actions .mi-button--primary { height: 30px; margin-left: 0; border-color: var(--mi-red); color: #fff !important; background: var(--mi-red); }' "$repo_dir/styles.css"
grep -Fq '.id-more-actions { color: #0071d0 !important; font-weight: 700 !important; }' "$repo_dir/styles.css"
grep -Fq '.id-more-actions img { filter: brightness(0) saturate(100%) invert(35%) sepia(74%) saturate(1351%) hue-rotate(174deg) brightness(91%) contrast(102%); }' "$repo_dir/styles.css"
grep -Fq 'margin-right: 16px;' "$repo_dir/styles.css"

echo "Instrument detail parent navigation test passed."
