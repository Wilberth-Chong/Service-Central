#!/usr/bin/env bash
set -euo pipefail

# Dashboard, Instruments, and Support history share the 210 × 40px primary action.
rg -Fq '.screen--dashboard .mi-titlebar > .mi-button--primary[data-route="request-support"], .screen--my-instruments .mi-titlebar > .mi-button--primary[data-route="request-support"], .screen--support-history .mi-titlebar > .mi-button--primary[data-route="request-support"] { width: 210px; height: 40px; border: 0; padding: 0 24px; color: #fff !important; background: var(--mi-red); }' styles.css

printf 'PASS: Start a request uses the shared dashboard button treatment\n'
