#!/usr/bin/env bash
set -euo pipefail

rg -q 'id="instrument-support-selection-template"' index.html
rg -q 'renderInstrumentSupportSelection()' app.js
rg -q 'data-iss-instrument' index.html
rg -q 'data-iss-continue' index.html
rg -q 'class="iss-page-number is-current"' index.html
rg -q 'class="iss-page-arrow' index.html
rg -q '\.iss-steps::after' styles.css
rg -q 'width: 16px; height: 16px;' styles.css
