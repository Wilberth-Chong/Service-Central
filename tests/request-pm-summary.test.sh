#!/usr/bin/env bash
set -euo pipefail

# Submitting the PM review must open a dedicated, populated submitted summary.
rg -Fq '"pm-request-summary"' app.js
rg -Fq 'function renderPmRequestSummary()' app.js
rg -Fq 'setRoute("pm-request-summary")' app.js
rg -Fq 'pm-request-summary-template' index.html
rg -Fq 'Request submitted:' index.html
rg -Fq 'data-pm-summary-scheduling-details' index.html
rg -Fq 'data-pm-summary-request-details' index.html
rg -Fq 'data-pm-summary-service-address' index.html
rg -Fq 'closeOnly: true, closeRoute: "request-support"' app.js
rg -Fq '.pm-review-selected .pm-details-selected-table, .pm-summary-selected .pm-details-selected-table { width: min(560px, 100%); }' styles.css

echo "PASS: PM submitted summary route is present"
