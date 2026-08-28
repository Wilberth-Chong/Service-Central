#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'function systemDetailTicketData(ticketRow, system)' app.js
grep -Fq 'function systemDetailSupportMarkup(system)' app.js
grep -Fq 'data-sd-ticket-index="${index}"' app.js
grep -Fq 'setRoute(summaryRouteForTicket(ticket), ticket);' app.js
grep -Fq 'data-route="support-history" data-platform-go-top-anchor' app.js
grep -Fq 'mountNativePageChrome("support-history", { title: ticket.title, backRoute: "support-history" });' app.js

if grep -Fq 'data-mi-toast="Ticket ${ticket} opened"' app.js; then
  echo "System Support tickets still use placeholder toast actions." >&2
  exit 1
fi

echo "System detail ticket routing test passed."
