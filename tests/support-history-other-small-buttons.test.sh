#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'class="mi-button mi-button--small sh-other-details"' app.js
rg -Fq '.mi-button.mi-button--small,' styles.css
printf 'PASS: Other requests View details actions use the Komodo small button size\n'
