#!/usr/bin/env bash
set -euo pipefail

# Step 2 must have an allow-listed Step 3 route, and retain the standard
# native-flow toolbar so its sidebar remains positioned within the shell.
rg -Fq '"request-pm-details": { title: "Request PM scheduling — add request details"' app.js
! rg -Fq '.screen--request-pm-status .flow-toolbar { display: none; }' styles.css
if rg -Fq '.screen--request-pm-status .mi-shell--native-flow > .topbar-sc { top: 0; }' styles.css; then
  exit 1
fi
rg -Fq 'styles.css?v=20260822-request-pm-status-v20' index.html
rg -Fq 'app.js?v=20260822-request-pm-status-v15' index.html
