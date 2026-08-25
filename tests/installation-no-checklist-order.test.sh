#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rg -q 'const NO_CHECKLIST_ORDER_NUMBER = "4827316059"' app.js
rg -q 'const NO_CHECKLIST_ORDER_ITEM_INDEXES = \[0, 2, 4, 6\]' app.js
rg -q 'const NO_CHECKLIST_ORDER_SCHEDULE_DETAILS = \[' app.js
rg -q 'data-no-checklist-order="4827316059"' app.js
rg -q 'PDFs are not available to download\. We’ve notified our team\. If we need any additional documentation, we will contact you\. No further action needed at this time\.' app.js
rg -q 'assets/icons/general/no document/size=24px, style=mono\.svg' app.js
rg -q 'assets/icons/general/no document/size=32px, style=mono\.svg' app.js
rg -q 'data-status-order="\$\{NO_CHECKLIST_ORDER_NUMBER\}"' app.js
rg -q 'noChecklistOrderState\.step3Complete = scenario !== "in-progress"' app.js
rg -q 'data-no-checklist-order-status' app.js
rg -q 'noChecklistOrderState\.statusScenario === "all-installed"' app.js
rg -q 'data-progress-order-modified' app.js
rg -q 'progressInstallationStatusScenario === "all-installed"' app.js
rg -q '\.ins-items th button:not\(:disabled\):hover' styles.css
rg -q '\.ins-action-card--no-checklist \{ border-left-color: #f56a00; \}' styles.css

test "$(rg -o 'data-no-checklist-item-status' app.js | wc -l | tr -d ' ')" -ge 2

echo "installation no-checklist order checks passed"
