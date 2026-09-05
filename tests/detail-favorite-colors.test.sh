#!/usr/bin/env bash
set -euo pipefail

css="styles.css"

blue_filter='invert(37%) sepia(93%) saturate(2039%) hue-rotate(182deg) brightness(90%)'

rg -Fq ".sd-favorite img { width: 24px; height: 24px; filter: ${blue_filter}; }" "$css"
rg -Fq ".sd-favorite[aria-pressed=\"true\"] img { filter: ${blue_filter}; }" "$css"
rg -Fq ".id-favorite img { width: 24px; height: 24px; filter: ${blue_filter}; }" "$css"
rg -Fq ".id-favorite[aria-pressed=\"true\"] img { filter: ${blue_filter}; }" "$css"

echo "Detail favorite color checks passed."
