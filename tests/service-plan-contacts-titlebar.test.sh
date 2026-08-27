#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq '.splan-top[data-platform-titlebar] { transition: none; }' "$repo_dir/styles.css"
sed -n '/^\.screen--service-plan-contacts \.splan-main::after {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'height: 301px;'

echo "Service plan contacts titlebar has stable compact scroll geometry."
