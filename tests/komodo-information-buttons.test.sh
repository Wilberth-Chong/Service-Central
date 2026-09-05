#!/usr/bin/env bash
set -euo pipefail

stylesheet="styles.css"
application="app.js"
entrypoint="index.html"

grep -Fq -- '--komodo-information-button-border: #92929e;' "$stylesheet"
grep -Fq -- '--komodo-information-button-border-hover: #54545c;' "$stylesheet"
grep -Fq -- '--komodo-information-button-label: #54545c;' "$stylesheet"
grep -Fq -- '--komodo-information-button-focus: #802eff;' "$stylesheet"
grep -Fq -- '.mi-button--information,' "$stylesheet"
grep -Fq -- '.mi-button--information.ins-activity,' "$stylesheet"
grep -Fq -- 'height: 32px !important;' "$stylesheet"
grep -Fq -- 'height: 40px !important;' "$stylesheet"
grep -Fq -- 'height: 48px !important;' "$stylesheet"
grep -Fq -- 'box-shadow: inset 0 2px 5px rgb(34 34 34 / 20%) !important;' "$stylesheet"
grep -Fq -- '#app .ins-order:not(.is-expanded) .ins-activity {' "$stylesheet"
grep -Fq -- 'display: none !important;' "$stylesheet"
grep -Fq -- 'class="mi-button mi-button--information ins-activity"' "$application"
grep -Fq -- 'class="mi-button mi-button--information ins-activity"' "$entrypoint"
grep -Fq -- 'styles.css?v=20260904-komodo-compliance-v14' "$entrypoint"

activity_button_count=$(grep -Fhc 'class="mi-button mi-button--information ins-activity"' "$application" "$entrypoint" | awk '{ total += $1 } END { print total }')
test "$activity_button_count" -eq 4

echo "Komodo information button compliance checks passed."
