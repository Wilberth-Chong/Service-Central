#!/usr/bin/env bash
set -euo pipefail

rg -q '^let selectedSupportHistoryTicket = null;' app.js
rg -q '^function setRoute(route, summaryTicket = null)' app.js
rg -q '^  selectedSupportHistoryTicket = summaryTicket;' app.js
rg -q 'app.js?v=20260819-summary-routing' index.html
