#!/usr/bin/env bash
set -euo pipefail

# PM Step 4 is an independent contact-information route using the same
# Komodo inputs and country/state single-select controls as qualification.
rg -Fq '"request-pm-contact"' app.js
rg -Fq 'function wireRequestPmContact()' app.js
rg -Fq 'function renderRequestPmContact()' app.js
rg -Fq 'setRoute("request-pm-contact")' app.js
rg -Fq 'mountTicketStepViewer(4' app.js
rg -Fq 'new KomodoSingleSelect(country)' app.js
rg -Fq 'new KomodoSingleSelect(state)' app.js
rg -Fq 'pmRequestDraft.contact' app.js
rg -Fq 'showToast("Continue to review and submit")' app.js

rg -Fq 'request-pm-contact-template' index.html
rg -Fq 'data-pm-contact-field="firstName"' index.html
rg -Fq 'data-pm-contact-field="country"' index.html
rg -Fq 'data-pm-contact-field="state"' index.html

echo "PASS: PM Step 4 contact flow structure is present"
