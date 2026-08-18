#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'function supportHistorySearchText(ticket)' app.js
rg -Fq '[ticket.serial, ticket.nickname, ticket.ticket, ticket.subject]' app.js
rg -Fq 'data-search="${supportHistorySearchText(ticket)}"' app.js
rg -Fq 'addEventListener("input", filterRows)' app.js

if rg -Fq 'data-search="${Object.values(ticket)' app.js; then
  echo "Support-history search must not index every ticket field." >&2
  exit 1
fi
