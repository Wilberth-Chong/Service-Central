#!/usr/bin/env bash
set -euo pipefail

rg -q 'id="request-support-native-template"' index.html
rg -q 'route === "request-support"' app.js
rg -q 'renderRequestSupport\(\)' app.js
rg -q 'data-route="instrument-support-selection"' index.html
