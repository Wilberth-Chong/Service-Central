#!/usr/bin/env bash
set -euo pipefail

rg -q 'route === "request-qualification"' app.js
rg -q 'data-route="request-qualification"' index.html
rg -q 'Request qualification service' app.js
