#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

sed -n '/^\.is-platform-titlebar-compact > \.ifaq-titlebar\[data-platform-titlebar\] {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'height: 88px;'
sed -n '/^\.is-platform-titlebar-compact > \.ifaq-titlebar \.ifaq-heading {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'display: contents;'
sed -n '/^\.is-platform-titlebar-compact > \.ifaq-titlebar \.ifaq-heading > button {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'display: inline-flex;'
sed -n '/^\.is-platform-titlebar-compact > \.ifaq-titlebar > \.platform-titlebar__go-top {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'grid-row: 2;'

echo "Installation FAQ compact header retains its parent navigation."
