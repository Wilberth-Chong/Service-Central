#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_JS="$ROOT_DIR/app.js"
STYLES="$ROOT_DIR/styles.css"

grep -Fq 'View submitted dates in the <button type="button" data-open-installation-activity' "$APP_JS"
grep -Fq 'createCompletedDeliveryDatesCardMarkup("9012611245")' "$APP_JS"
grep -Fq 'createCompletedDeliveryDatesCardMarkup("7659430547")' "$APP_JS"
grep -Fq 'installationActivityEntries.filter((entry) => entry.orderNumber === orderNumber)' "$APP_JS"
grep -Fq '"latest delivery date"' "$APP_JS"
grep -Fq '"earliest delivery date"' "$APP_JS"
grep -Fq 'Paused Preferred delivery date submission for ${selectedPause} days' "$APP_JS"
grep -Fq '.ins-action-card.is-complete .ins-action-card__activity-link' "$STYLES"

echo "Installation completed delivery card checks passed."
