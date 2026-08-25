#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rg -q 'function wireOrderEmailTooltips' app.js
rg -q 'wireOrderEmailTooltips\(app\)' app.js
rg -q 'alexander.constantine@companyname.com' app.js
rg -q 'support_team_na@thermofisher.com' app.js
rg -q 'assets/installations/shared-email-tooltip.svg' app.js
rg -q '\.ins-order-email-tooltip' styles.css
rg -q 'right: -30px' styles.css
rg -q 'top: 26px; left: 22px; width: 273px' styles.css
test -f assets/installations/shared-email-tooltip.svg

echo "Installation order email tooltip checks passed."
