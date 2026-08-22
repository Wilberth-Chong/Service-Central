#!/usr/bin/env bash
set -euo pipefail

# Step 4 transitions to a PM-specific review and submit screen.
rg -Fq '"request-pm-review"' app.js
rg -Fq 'function renderRequestPmReview()' app.js
rg -Fq 'setRoute("request-pm-review")' app.js
rg -Fq 'mountTicketStepViewer(5' app.js
rg -Fq 'data-pm-review-scheduling-details' index.html
rg -Fq 'data-pm-review-request-details' index.html
rg -Fq 'data-pm-review-contact="phone"' index.html
rg -Fq 'request-pm-review-template' index.html

echo "PASS: PM Step 5 review route is present"
