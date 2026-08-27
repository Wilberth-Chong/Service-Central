#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'function dashboardTicketDataFromRow(row)' app.js
grep -Fq 'const ticketLink = event.target.closest("[data-db-ticket-link]");' app.js
grep -Fq 'setRoute(summaryRouteForTicket(ticket), ticket);' app.js
grep -Fq 'href="#support-history" data-db-ticket-link' index.html
grep -Fq 'href="#support-history" data-db-ticket-link' app.js

if grep -Fq 'href="#ticket-detail"' index.html; then
  echo "Dashboard ticket links still target the image-based ticket route." >&2
  exit 1
fi

echo "Dashboard ticket routing test passed."
