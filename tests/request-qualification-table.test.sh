#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'function wireRequestQualification()' app.js
rg -Fq 'mountTicketStepViewer(1, {' app.js
rg -Fq 'data-qualification-select-all' app.js
rg -Fq 'data-qualification-filter-host' app.js
rg -Fq 'new window.MultiSelectFilter' app.js
rg -Fq 'data-qualification-page-size' app.js
rg -Fq 'labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"]' app.js
rg -Fq 'data-qualification-select-all-table' app.js
rg -Fq 'const setAllSystemRows' app.js
rg -Fq 'systemCheckbox.addEventListener("change", () => setAllSystemRows(systemCheckbox.checked))' app.js

printf 'PASS: qualification uses shared ticket step viewer and ISS-style table controls\n'
