#!/usr/bin/env bash
set -euo pipefail

# Step 3 keeps the two PM-status selections separate instead of repeating all
# Step 1 instruments in both disclosures.
rg -Fq 'schedulingInstruments: [], requestInstruments: []' app.js
rg -Fq 'data-pm-status-instruments' app.js
rg -Fq 'function collectPmStatusInstruments(tableLabel)' app.js
rg -Fq 'pmRequestDraft.schedulingInstruments = collectPmStatusInstruments("Request PM scheduling instruments")' app.js
rg -Fq 'pmRequestDraft.requestInstruments = collectPmStatusInstruments("Request PM instruments")' app.js
rg -Fq 'pmRequestDraft[`${key}Instruments`]' app.js

# The PM detail callouts size to their content and use the platform blue.
rg -Fq '.pm-details-info { display: flex; align-self: start;' styles.css
rg -Fq 'border-left: 8px solid #0071d0' styles.css
! rg -Fq '.pm-details-info { display: flex; min-height: 137px;' styles.css

# The Step 3 callouts and promotion use one blue treatment, including icons.
rg -Fq '.pm-status-promotion { display: flex;' styles.css
rg -Fq 'border-left: 8px solid #0071d0' styles.css
rg -Fq '.pm-status-promotion > img, .pm-details-info > img' styles.css
