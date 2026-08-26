#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'To help us meet your preferred delivery timeline, please request your dates for delivery.' "$repo_dir/index.html"
grep -Fq 'select “Add user to order” to invite the correct person to take this action.' "$repo_dir/index.html"
grep -Fq 'aria-label="Earliest delivery date" data-delivery-date-required disabled' "$repo_dir/index.html"
grep -Fq 'function getTodayDeliveryDate()' "$repo_dir/app.js"
grep -Fq "querySelector('[aria-label=\"Earliest delivery date\"]').value = getTodayDeliveryDate();" "$repo_dir/app.js"
if grep -Fq 'value="10/12/25" aria-label="Earliest delivery date"' "$repo_dir/index.html"; then
  echo "Earliest delivery date still uses the fixed prototype date." >&2
  exit 1
fi
grep -Fq 'The earliest date you can receive the instrument(s).' "$repo_dir/index.html"
grep -Fq 'Enter the latest date you can receive the instrument(s).' "$repo_dir/index.html"
grep -Fq 'grid-template-columns: repeat(2, minmax(0, 1fr))' "$repo_dir/styles.css"

if grep -Fq '>Preferred delivery date<' "$repo_dir/index.html"; then
  echo "Preferred delivery date field is still present." >&2
  exit 1
fi

echo "Preferred delivery dates modal test passed."
