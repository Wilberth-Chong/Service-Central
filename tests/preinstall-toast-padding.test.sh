#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

test "$(rg -o 'variant: "preinstall-checklist"' app.js | wc -l | tr -d ' ')" -eq 2
rg -q 'toast\.classList\.toggle\("toast--preinstall", isPreInstallChecklist\)' app.js
rg -q '\.toast\.toast--preinstall \{' styles.css
rg -q 'padding: 16px;' styles.css
rg -q '\.toast--preinstall \.toast__content' styles.css
rg -q 'margin-left: 16px' styles.css

echo "pre-install toast padding checks passed"
