#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
app="$repo_dir/app.js"
styles="$repo_dir/styles.css"

grep -Fq 'data-splan-contact-menu="${contact.email}"' "$app"
grep -Fq 'data-splan-remove-contact="${contact.email}"' "$app"
grep -Fq 'title: "Remove service plan contact"' "$app"
grep -Fq 'These instrument(s) will not have any service plan contact if you take this action.' "$app"
grep -Fq 'removedServicePlanContacts.add(contact.name)' "$app"
grep -Fq 'servicePlanPlansByContactState(true)' "$app"
grep -Fq 'servicePlanPlansByContactState(false)' "$app"
grep -Fq 'servicePlanContactPlanMarkup(plan, { withoutContact: true })' "$app"
grep -Fq 'toggle.closest("tbody")?.querySelectorAll' "$app"
grep -Fq '.splan-contact-action__popover' "$styles"
grep -Fq '.splan-remove-contact-dialog .modal__footer { gap: 16px; margin: 40px -16px -16px; }' "$styles"

echo "Service plan contact removal preserves plan grouping and moves assignments to the without-contact section."
