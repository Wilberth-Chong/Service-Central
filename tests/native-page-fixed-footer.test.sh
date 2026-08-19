#!/usr/bin/env bash
set -euo pipefail

css_file="styles.css"

test -f "$css_file"
rg -q '\.screen--ticket-summary \[data-footer-mount\] \.footer,' "$css_file"
rg -q '\.screen--request-installation \[data-footer-mount\] \.footer \{' "$css_file"
rg -q 'position: fixed;' "$css_file"
rg -q 'z-index: 20;' "$css_file"
rg -q 'left: max\(58px, calc\(\(100vw - 1440px\) / 2 \+ 58px\)\);' "$css_file"
rg -q 'styles\.css\?v=20260819-native-page-main-viewport' index.html

printf 'PASS: native flow footer is fixed above the shell edge\n'
