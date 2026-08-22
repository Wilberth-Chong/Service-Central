#!/usr/bin/env bash
set -euo pipefail

# Only TSQ-Z-12347's Step 1 serial action opens the confirmed-PM review.
rg -Fq '"request-pm-direct-review"' app.js
rg -Fq 'function renderRequestPmDirectReview()' app.js
rg -Fq 'setRoute("request-pm-direct-review")' app.js
rg -Fq 'data-pm-direct-review-trigger' index.html
rg -Fq 'querySelector("[data-pm-direct-review-trigger]")' app.js
rg -Fq 'pmRequestDraft.instruments.length === 1 && pmRequestDraft.instruments[0].serial === "TSQ-Z-12347"' app.js
rg -Fq 'setRoute("request-pm-status")' app.js
rg -Fq 'pm-direct-review-template' index.html
rg -Fq 'All instrument(s) have a scheduled PM:' index.html
rg -Fq 'success/size=24px, style=bold-green.svg' index.html
rg -Fq '#00A62C' 'assets/icons/notifications/success/size=24px, style=bold-green.svg'
rg -Fq 'cancelRoute: "request-support", backRoute: "request-pm", primaryLabel: "Close", primaryRoute: "request-support"' app.js

echo "PASS: direct PM review route is present"
