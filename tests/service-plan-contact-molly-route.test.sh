#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq '<button type="button" data-route="contact-page">Molly Hartman</button>' "$repo_dir/index.html"
if grep -Fq 'data-splan-action="Molly Hartman"' "$repo_dir/index.html"; then
  echo "Molly Hartman must not use a selection-only action." >&2
  exit 1
fi

echo "Molly Hartman opens the shared contact detail route."
