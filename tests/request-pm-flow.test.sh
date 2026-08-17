#!/usr/bin/env bash
set -euo pipefail

rg -q 'id="request-pm-native-template"' index.html
rg -q 'route === "request-pm"' app.js
rg -q 'data-route="request-pm"' index.html
rg -q 'data-pm-instrument' index.html
