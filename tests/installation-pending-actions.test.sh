#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rg -q 'Add your preferred delivery dates for order: <strong>9012611245</strong>' app.js
rg -q 'Upload the pending delivery checklist for order: <strong>9012611245</strong>' app.js
rg -q 'preInstallOrderNumbers = \["9012611245", "7659430547"\]' app.js
rg -q 'preInstallOrderNumbers\.join\(", "\)' app.js
rg -q 'if \(submittedPreInstallChecklists\.length < PREINSTALL_CHECKLISTS\.length\) preInstallOrderNumbers\.push\("9012611245"\)' app.js
rg -q 'if \(!isProgressPreInstallComplete\(\)\) preInstallOrderNumbers\.push\("7659430547"\)' app.js
rg -q 'showDeliveryDates: !preferredDeliveryDatesSubmitted' app.js
rg -q 'showDeliveryChecklist: !deliveryChecklistSubmitted' app.js
rg -q 'refreshInstallationPendingContent\(\);' app.js
rg -q 'Installation complete for order <strong>1901126245</strong>' app.js
rg -q 'Installation complete for order <strong>323146241</strong>' app.js
rg -q 'data-installation-pending-contact-support' app.js
rg -q '\["1901126245", \{ expanded: false, status: "default" \}\]' app.js
rg -q '\.installation-pending-dialog \{ height: fit-content; max-height: calc\(100vh - 32px\); \}' styles.css
rg -q '\.installation-pending-dialog\[open\] \{ display: block; \}' styles.css
rg -q '\.installation-pending-dialog \.modal__surface \{ height: fit-content; max-height: calc\(100vh - 32px\); padding: 48px; \}' styles.css

if rg -q '\{ number: "323146241", orderedDate:' app.js || rg -q 'value="323146241"' index.html; then
  echo "Removed order 323146241 is still present in an order list" >&2
  exit 1
fi

if rg -q 'Installation complete for order <strong>3456789</strong>' app.js; then
  echo "Placeholder installation order remains in pending actions" >&2
  exit 1
fi

echo "installation pending actions checks passed"
