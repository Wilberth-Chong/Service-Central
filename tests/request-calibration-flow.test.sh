#!/usr/bin/env bash
set -euo pipefail

rg -q 'id="request-calibration-native-template"' index.html
rg -q 'route === "request-calibration"' app.js
rg -q 'data-route="request-calibration"' index.html
rg -q 'data-cal-instrument' index.html
