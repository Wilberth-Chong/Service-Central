#!/usr/bin/env bash
set -euo pipefail

# Support History uses the shared My Instruments edit-columns dialog.
rg -Fq 'const SUPPORT_HISTORY_COLUMNS' app.js
rg -Fq 'function openSupportHistoryColumnDialog()' app.js
rg -Fq 'function applySupportHistoryColumnVisibility()' app.js
rg -Fq 'const SUPPORT_HISTORY_FIXED_COLUMNS' app.js
rg -Fq '{ key: "status", index: 1, label: "Status", width: 113, required: true }' app.js
rg -Fq '{ key: "ticket", index: 2, label: "Ticket no.", width: 118, required: true }' app.js
rg -Fq '{ key: "serial", index: 6, label: "Serial no.", width: 108, required: true }' app.js
! rg -Fq '{ key: "indicator", label: "Ticket indicator"' app.js
! rg -Fq '{ key: "systems", label: "Systems"' app.js
rg -Fq '{ key: "nickname", index: 8, label: "Nickname", width: 118 }' app.js
rg -Fq '{ key: "groups", index: 9, label: "Groups", width: 113 }' app.js
rg -Fq '{ key: "contact", index: 10, label: "Contact", width: 113 }' app.js
rg -Fq '{ key: "created", index: 11, label: "Created date", width: 114 }' app.js
rg -Fq '{ key: "closed", index: 12, label: "Closed date", width: 118 }' app.js

echo "PASS: Support History edit-columns integration is present"
