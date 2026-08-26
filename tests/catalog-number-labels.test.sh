#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

legacy_labels='Model no\.|Model [Nn]umber|>Model([ <])|label: "Model"|"model", "Model"'

if rg -n "$legacy_labels" app.js index.html; then
  echo "Legacy model labels remain in user-facing markup." >&2
  exit 1
fi

catalog_label_count="$(rg -o 'Catalog no\.' app.js index.html | wc -l | tr -d ' ')"
if (( catalog_label_count < 30 )); then
  echo "Expected Catalog no. across all cards, tables, filters, and details; found ${catalog_label_count}." >&2
  exit 1
fi

echo "Catalog number labels are consistent across the platform."
