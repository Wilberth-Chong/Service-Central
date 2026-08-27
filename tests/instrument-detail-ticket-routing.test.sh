#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'function instrumentDetailTicketData(ticketRow, instrument)' app.js
grep -Fq 'function instrumentDetailTicketRows(instrument)' app.js
grep -Fq 'data-id-ticket-index="${index}"' app.js
grep -Fq 'setRoute(summaryRouteForTicket(ticket), ticket);' app.js
grep -Fq 'data-route="support-history" data-platform-go-top-anchor' app.js
grep -Fq 'const summaryCloseRoute = ticket.submitted ? "request-support" : "support-history";' app.js

if grep -Fq '<tbody>${instrument1009996TicketRows()}</tbody>' app.js; then
  echo "Instrument Support tickets still use the legacy image-detail routing." >&2
  exit 1
fi

echo "Instrument detail ticket routing test passed."
