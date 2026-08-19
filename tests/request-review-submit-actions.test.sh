#!/usr/bin/env bash
set -euo pipefail

awk '/\.screen--request-qualification-details \.platform-sidebar,/,/}/' styles.css | rg -Fq 'left: max(0px, calc((100vw - 1440px) / 2));'
test "$(rg -F 'textContent = "Submit";' app.js | wc -l | tr -d ' ')" -ge 2

printf 'PASS: qualification step 2 aligns its sidebar and review actions use Submit\n'
