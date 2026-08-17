#!/usr/bin/env bash
set -euo pipefail

rg -q 'id="request-serviceplan-native-template"' index.html
rg -q 'route === "request-serviceplan"' app.js
rg -q 'data-route="request-serviceplan"' index.html
rg -q 'data-sp-instrument' index.html
