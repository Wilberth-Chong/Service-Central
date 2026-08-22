#!/usr/bin/env bash
set -euo pipefail

# The PM five-step grey connector ends at the Step 5 circle on Steps 2–4.
for screen in request-pm-status request-pm-details request-pm-contact; do
  rg -Fq ".screen--${screen} .iss-steps--five::before { width: 80%; }" styles.css
done

echo "PASS: PM Step 2–4 connectors end at Step 5"
