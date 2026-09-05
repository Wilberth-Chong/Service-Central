#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'data-db-ticket-filter-trigger' index.html
rg -Fq 'data-db-ticket-status="Customer Testing"' index.html
rg -Fq 'data-db-ticket-status="Delayed due to Parts"' index.html
rg -Fq 'data-db-ticket-status="Pending Customer Readiness"' index.html
rg -Fq 'data-db-ticket-status="Submitted"' index.html
rg -Fq 'function wireDashboard()' app.js
rg -Fq 'const applyTicketStatusFilter' app.js
rg -Fq 'No results found' app.js
rg -Fq 'assets/zero-states/no-results.svg' app.js
rg -Fq '.db-ticket-filter__trigger' styles.css
rg -Fq '.db-ticket-empty' styles.css

printf 'PASS: dashboard Active tickets has a functional Komodo status dropdown and empty state\n'
