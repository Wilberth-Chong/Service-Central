#!/usr/bin/env bash
set -euo pipefail

awk '/\.screen--request-qualification-details \.platform-sidebar,/,/}/' styles.css | rg -Fq 'left: max(0px, calc((100vw - 1440px) / 2));'
rg -Fq 'styles.css?v=20260820-qualification-review-actions' index.html

printf 'PASS: qualification contact and review sidebars align to the application shell\n'
