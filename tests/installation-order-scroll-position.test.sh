#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rg -q 'function setProgressOrderExpanded\(order, expanded\)' app.js
rg -q 'function setNoChecklistOrderExpanded\(order, expanded\)' app.js
rg -q 'function replaceInstallationOrderRoute\(route, title\)' app.js
rg -q 'setProgressOrderExpanded\(order, event\.currentTarget\.getAttribute' app.js
rg -q 'setNoChecklistOrderExpanded\(order, event\.currentTarget\.getAttribute' app.js
! rg -q 'preserveScroll: true' app.js

echo "installation order scroll-position checks passed"
