#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_JS="$ROOT_DIR/app.js"
STYLES="$ROOT_DIR/styles.css"

for expected_copy in \
  "Complete the action(s) required at the top of this order." \
  "Complete the checklist(s) required for this order." \
  "The installation date has been scheduled." \
  "Installation is complete and your instrument is available in My instruments page." \
  "Item is cancelled."; do
  grep -Fq "$expected_copy" "$APP_JS"
done

grep -Fq 'if (index === 4) return "Cancelled";' "$APP_JS"
grep -Fq 'status: getProgressOrderItemStatus(index)' "$APP_JS"
if grep -Fq 'orderNumber === "1901126245" && index === 4' "$APP_JS"; then
  echo "Order 1901126245 must not retain the Cancelled status." >&2
  exit 1
fi
grep -Fq 'status: getWhiteGloveItemStatus(orderNumber, status, index)' "$APP_JS"
grep -Fq 'shell-detail-status--cancelled' "$APP_JS"
grep -Fq '.ins-installation-state--cancelled { color: #6c2501; background: #ffebd6; font-size: 12px; font-weight: 500; line-height: 18px; }' "$STYLES"
grep -Fq '.shell-detail-status--cancelled { color: #6c2501; background: #ffebd6; }' "$STYLES"

echo "Installation line-item status tooltip checks passed."
