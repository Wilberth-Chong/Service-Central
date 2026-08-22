#!/usr/bin/env bash
set -euo pipefail

# Regression: the PM scheduling flow rebuild must invalidate the browser-cached
# assets that supply its markup, styling, and shared step-viewer behavior.
rg -Fq 'styles.css?v=20260822-request-pm-status-v20' index.html
rg -Fq 'ticket-step-viewer.js?v=20260822-request-pm-status-v2' index.html
rg -Fq 'app.js?v=20260822-request-pm-status-v15' index.html
