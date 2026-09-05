#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
app="$repo_dir/app.js"
styles="$repo_dir/styles.css"
index="$repo_dir/index.html"

grep -Fq 'renderEditSpcInstrumentTable();' "$app"
grep -Fq 'servicePlanPlansByContactState(true)' "$app"
grep -Fq 'servicePlanPlansByContactState(false)' "$app"
grep -Fq 'label: "Instruments with no service plan"' "$app"
grep -Fq 'data-spc-contact-state="${state}"' "$app"
grep -Fq 'contactFilter = button.textContent.trim() === "With contact"' "$app"
grep -Fq 'button.textContent.trim() === "Without contact" ? "without" : "all"' "$app"
grep -Fq 'data-spc-group-toggle="${id}"' "$app"
grep -Fq 'data-spc-group-child="${id}"' "$app"
grep -Fq 'class="spc-contact-cell">—</td>' "$app"
grep -Fq '.spc-table td.spc-contact-cell {' "$styles"
grep -Fq 'font-size: 14px;' "$styles"
grep -Fq 'line-height: 22px;' "$styles"
grep -Fq 'text-align: left !important;' "$styles"
grep -Fq 'overflow: visible;' "$styles"
if grep -Fq '.spc-table-wrap::after {' "$styles"; then
  echo "Edit service plan contact table must not render a decorative scrollbar." >&2
  exit 1
fi
if grep -Fq 'data-spc-close' "$index"; then
  echo "Edit service plan contact action bar must not include a Close button." >&2
  exit 1
fi
grep -Fq 'position: sticky;' "$styles"
grep -Fq 'margin-bottom: 48px;' "$styles"
grep -Fq 'if (actionBar) actionBar.hidden = true;' "$app"
grep -Fq 'const contactCombinationForRow = (row) => parseSpcContactEmails(' "$app"
grep -Fq 'assetRow.querySelector("td:first-child input[type='"'"'checkbox'"'"']")' "$app"
grep -Fq 'selectedGroupAssets.map(contactCombinationForRow)' "$app"
grep -Fq 'const groupContactLabel = contactEmails.length > 1 ? "Multiple"' "$app"
grep -Fq 'trigger.dataset.spcContactLabel || formatSpcContactList(emails)' "$app"
grep -Fq 'const selectedServicePlanAssetKeys = () =>' "$app"
grep -Fq 'servicePlanContactOverrides.set(assetKey, [...confirmedContactEmails]);' "$app"
grep -Fq 'return allServicePlanPlans().map((plan) =>' "$app"
grep -Fq '.spc-table .spc-row--group > td.spc-contact-cell {' "$styles"
grep -Fq 'padding: 0 10px;' "$styles"
grep -Fq 'const selectableGroupAssets = (groupId) =>' "$app"
grep -Fq 'checkbox.checked = groupCheckbox.checked;' "$app"
grep -Fq 'groupCheckbox.indeterminate = selectedCount > 0 && selectedCount < assetCheckboxes.length;' "$app"
grep -Fq 'groupCheckbox.setAttribute("aria-checked", groupCheckbox.indeterminate ? "mixed" : String(groupCheckbox.checked));' "$app"
if grep -Fq 'SPC_SELECTION_CONTACT_COMBINATIONS' "$app"; then
  echo "Edit service plan contacts must derive contact combinations from selected live rows." >&2
  exit 1
fi

echo "Edit service plan contact uses current grouped plan data with working contact-state filters."
