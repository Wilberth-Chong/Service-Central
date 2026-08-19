#!/usr/bin/env bash
set -euo pipefail

app_file="app.js"

test -f "$app_file"
rg -q '^function mountNativePageChrome\(activeRoute\) \{' "$app_file"
rg -q 'mountNativePageChrome\("support-history"\);' "$app_file"

request_support_calls=$(rg -c 'mountNativePageChrome\("request-support"\);' "$app_file")
test "$request_support_calls" -eq 8

rg -q 'app\.js\?v=20260819-shared-page-chrome' index.html

printf 'PASS: shared page chrome mounts all approved routes\n'
