#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'flex-direction: column;' multi-select-filter.css
rg -Fq 'max-height: 360px;' multi-select-filter.css
rg -Fq 'flex: 0 0 40px;' multi-select-filter.css
rg -Fq ':root body .msf__menu .msf__option {' styles.css
rg -Fq ':root body .db-ticket-filter__menu {' styles.css
printf 'PASS: table-filter dropdowns stack options and cap long menus\n'
