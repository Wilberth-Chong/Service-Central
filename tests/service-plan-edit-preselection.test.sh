#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
app="$repo_dir/app.js"

grep -Fq 'let servicePlanEditPreselection = new Set();' "$app"
grep -Fq 'function servicePlanSelectionGroupId(planNumber, withoutContact = false)' "$app"
grep -Fq 'data-splan-selection-id="${selectionId}"' "$app"
grep -Fq 'data-spc-selection-id="${groupId}:instrument:${instrument.serial}"' "$app"
grep -Fq 'data-spc-selection-id="${id}:system:${item.systemId}"' "$app"
grep -Fq 'checkbox.checked = servicePlanEditPreselection.has(checkbox.dataset.spcSelectionId)' "$app"
grep -Fq 'const groupsWithSelectedInstruments = new Set(' "$app"
grep -Fq 'row.hidden = false;' "$app"
grep -Fq 'servicePlanEditPreselection = new Set(' "$app"
grep -Fq 'data-splan-check]:checked' "$app"
grep -Fq 'const SERVICE_PLAN_NO_PLAN = Object.freeze({' "$app"
grep -Fq 'id.includes("no-service-plan")' "$app"
grep -Fq 'data-splan-edit-selection="${selectionId}"' "$app"
grep -Fq 'data-splan-edit-selection="${groupSelectionId}"' "$app"
grep -Fq 'const directSelection = button.dataset.splanEditSelection;' "$app"
grep -Fq 'servicePlanEditPreselection = new Set([directSelection]);' "$app"
grep -Fq 'data-splan-edit-contact="${contact.email}"' "$app"
grep -Fq 'const contactEmail = button.dataset.splanEditContact;' "$app"
grep -Fq '.filter((item) => servicePlanItemContactEmails(item, plan).some((email) => email.toLowerCase() === contactEmail.toLowerCase()))' "$app"

echo "Service plan selections carry from the main page into the edit flow."
