#!/usr/bin/env bash
set -euo pipefail

css_file="styles.css"
main_rule=$(awk '/^\.mi-shell--native-flow > \.mi-main \{/{capture=1} capture{print} capture && /^}/{exit}' "$css_file")

printf '%s\n' "$main_rule" | rg -q 'margin-top: var\(--platform-topbar-height\);'
if printf '%s\n' "$main_rule" | rg -q 'padding-top: var\(--platform-topbar-height\);'; then
  exit 1
fi
rg -q '\.screen--ticket-summary,' "$css_file"
rg -q '\.screen--request-installation \{' "$css_file"
rg -q 'overflow-x: hidden;' "$css_file"
rg -q 'styles\.css\?v=20260819-native-page-main-viewport' index.html

printf 'PASS: native main ends at the footer without page-level horizontal overflow\n'
