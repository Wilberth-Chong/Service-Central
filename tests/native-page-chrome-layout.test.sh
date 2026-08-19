#!/usr/bin/env bash
set -euo pipefail

css_file="styles.css"

test -f "$css_file"
rg -q '\.screen--ticket-summary \.mi-stage,' "$css_file"
rg -q '\.screen--request-support \.mi-stage,' "$css_file"
rg -q '\.screen--request-installation \.mi-stage \{' "$css_file"
rg -q 'overflow: visible;' "$css_file"
rg -q '\.screen--request-support \.platform-sidebar,' "$css_file"
rg -q '\.screen--request-installation \.platform-sidebar \{' "$css_file"
rg -q 'left: max\(0px, calc\(\(100vw - 1440px\) / 2\)\);' "$css_file"
rg -q 'styles\.css\?v=20260819-native-page-flow-toolbar' index.html

printf 'PASS: native page chrome keeps footers reachable and sidebars shell-aligned\n'
