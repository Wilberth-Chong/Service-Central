#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if rg -q '\{ number: "323146241", orderedDate:' app.js || rg -q 'value="323146241"' index.html; then
  echo "Removed order 323146241 is still present in an order list" >&2
  exit 1
fi
if rg -q 'data-progress-additional-toggle|data-progress-additional-panel|data-progress-additional-items' app.js; then
  echo "Progress order 7659430547 still contains additional-items UI" >&2
  exit 1
fi
rg -q 'data-wg-additional-toggle' app.js

echo "Installation order additional-items checks passed."
