#!/usr/bin/env bash
set -euo pipefail

css="styles.css"
html="index.html"

rg -Fq '.mi-suggestions-table th:nth-child(8) { width: 188px; }' "$css"
rg -Fq '.mi-related-table th:nth-child(10) { width: 188px; }' "$css"
rg -Fq '.mi-invites-table th:nth-child(9) { width: 188px; }' "$css"
rg -Fq '.mi-suggestions-table :is(th, td):nth-child(8),' "$css"
rg -Fq '.mi-related-table :is(th, td):nth-child(10),' "$css"
rg -Fq '.mi-invites-table :is(th, td):nth-child(9) { padding-right: 14px; padding-left: 14px; text-overflow: clip; }' "$css"
rg -Fq 'styles.css?v=20260904-komodo-compliance-v16' "$html"

echo "Suggestion action column width checks passed."
