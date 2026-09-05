#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
css_file="$root_dir/multi-select-filter.css"

grep -Fq '.msf__menu--figma-column .msf__sort { flex: 0 0 36px; }' "$css_file"
grep -Fq 'flex: 0 0 28px;' "$css_file"
grep -Fq 'height: 40px; flex: 0 0 40px;' "$css_file"

echo "Table filter Sort rows preserve the Groups-filter spacing in scrollable menus."
