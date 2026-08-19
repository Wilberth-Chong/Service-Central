#!/usr/bin/env bash
set -euo pipefail

test -f platform-action-bar.js
rg -q 'function mountNativeFlowActionBar' app.js
test "$(rg -c 'mountNativeFlowActionBar\(' app.js)" -ge 8
test "$(rg -c 'data-platform-action-bar-mount' index.html)" -ge 7
! rg -q '<div class="(?:iss-actionbar|pm-actionbar)' index.html
test "$(rg -c 'data-actionbar-action="primary"' app.js)" -ge 7
rg -Fq 'if (pmSelectedCount)' app.js
rg -Fq 'if (spSelectedCount)' app.js
rg -q '\.platform-actionbar--native-flow \{' styles.css
rg -A 12 '\.platform-actionbar--native-flow \{' styles.css | rg -q 'position: fixed;'
rg -Uq 'const button = pendingCancelButton;\n      closeCancelDialog\(\);\n      if \(!button\) return;\n      button\.dataset\.actionbarCancelConfirmed' platform-action-bar.js

printf 'PASS: native flows mount the shared platform action bar\n'
