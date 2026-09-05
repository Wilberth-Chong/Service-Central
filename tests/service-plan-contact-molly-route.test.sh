#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq '{ name: "Molly Hartman", email: "molly.hartman@company.com" }' "$repo_dir/app.js"
grep -Fq 'instrumentCount: servicePlanContactInstrumentCount(contact.name)' "$repo_dir/app.js"
grep -Fq '<button type="button" data-route="contact-page">${contact.name}</button>' "$repo_dir/app.js"
if grep -Fq 'data-splan-action="Molly Hartman"' "$repo_dir/app.js"; then
  echo "Molly Hartman must not use a selection-only action." >&2
  exit 1
fi

echo "Molly Hartman opens the shared contact detail route."
