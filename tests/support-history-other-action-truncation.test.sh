#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq '.sh-other-col-action { width: 144px; }' styles.css
rg -Fq '.sh-other-table td:last-child { overflow: visible; text-overflow: clip; }' styles.css
printf 'PASS: Other requests View details actions are not truncated with ellipses\n'
