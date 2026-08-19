#!/usr/bin/env bash
set -euo pipefail

css_file="styles.css"

test -f "$css_file"
main_rule=$(awk '/^\.mi-shell--native-flow > \.mi-main \{/{capture=1} capture{print} capture && /^}/{exit}' "$css_file")

rg -q '\.screen--ticket-summary \.mi-stage,' "$css_file"
rg -q '\.screen--request-installation \.mi-stage \{' "$css_file"
rg -q 'height: var\(--platform-shell-height\);' "$css_file"
rg -q '\.mi-shell--native-flow \{' "$css_file"
rg -q '\.mi-shell--native-flow > \.mi-main \{' "$css_file"
printf '%s\n' "$main_rule" | rg -q 'height: var\(--platform-page-body-height\);'
printf '%s\n' "$main_rule" | rg -q 'overflow-x: hidden;'
printf '%s\n' "$main_rule" | rg -q 'overflow-y: auto;'
printf '%s\n' "$main_rule" | rg -q 'overscroll-behavior: contain;'
rg -q 'styles\.css\?v=20260819-native-flow-scroll-container' index.html

printf 'PASS: native flow pages use the platform scroll container\n'
