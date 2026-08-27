#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

sed -n '/^\.shell-detail-back {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'font-weight: 700 !important;'
sed -n '/^\.ifaq-heading > button {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'font-weight: 700 !important;'

echo "Installation back labels use the bold navigation treatment."
