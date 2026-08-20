#!/usr/bin/env bash
set -euo pipefail

rg -Fq '"qualification-summary"' app.js
rg -Fq 'function renderQualificationSummary()' app.js
rg -Fq 'setRoute("qualification-summary")' app.js
rg -Fq 'qualification-summary-template' index.html
rg -Fq 'Request submitted:' index.html
rg -Fq 'data-qualification-summary-details' index.html
rg -Fq 'data-qualification-summary-contact' index.html

printf 'PASS: qualification summary route, dynamic content mounts, and submit transition are present\n'
