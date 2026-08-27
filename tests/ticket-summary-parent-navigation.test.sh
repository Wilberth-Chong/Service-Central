#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'class="ts-parent-navigation" type="button" data-route="support-history" data-platform-go-top-anchor' "$repo_dir/app.js"
sed -n '/^\.ts-parent-navigation {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'font-weight: 700 !important;'
sed -n '/^\.is-platform-titlebar-compact > \.ts-titlebar \.ts-parent-navigation {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'grid-row: 1;'

echo "Ticket summary titlebars retain their Support history navigation."
