#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
app="$repo_dir/app.js"
styles="$repo_dir/styles.css"

for contact in \
  "Gerard Campbell|gerard.campbell@company.com" \
  "Jon Doe|jon.doe@company.com" \
  "Mary Smith|mary.smith@company.com" \
  "Molly Hartman|molly.hartman@company.com" \
  "Thomas Mayer|thomas.mayer@company.com"; do
  name="${contact%%|*}"
  email="${contact#*|}"
  grep -Fq "name: \"$name\", email: \"$email\"" "$app"
done

if grep -Fq '{ name: "Holly Hartman", email: "holly.hartman@company.com"' "$app"; then
  echo "The duplicate Holly Hartman service plan contact card must not be rendered." >&2
  exit 1
fi

for plan in 0040111111 0040222222 0040333333 0040444444 0040555555; do
  grep -Fq "number: \"$plan\"" "$app"
done

for plan in 0040666666 0040777777 0040888888; do
  grep -Fq "number: \"$plan\"" "$app"
done

grep -Fq 'plansWithContact.reduce((count, plan) => count + servicePlanPlanInstrumentCount(plan), 0)' "$app"
grep -Fq '`${instrumentCount} out of ${instrumentCount + withoutContactCount} instruments with a service plan contact`' "$app"
grep -Fq '`${withoutContactCount} out of ${instrumentCount + withoutContactCount} instruments without a service plan contact`' "$app"
grep -Fq 'const initiallyExpanded = plan.number === SERVICE_PLAN_NO_PLAN.number;' "$app"
grep -Fq 'aria-expanded="${initiallyExpanded}"' "$app"
grep -Fq 'aria-label="${initiallyExpanded ? "Collapse" : "Expand"} ${planLabel}"' "$app"
grep -Fq 'rows.map((row) => row.replace(" hidden>", ">"))' "$app"
grep -Fq 'chevron right/size=16px, style=mono.svg' "$app"
grep -Fq 'data-splan-plan-child="${plan.number}"' "$app"
grep -Fq 'renderServicePlanContactData();' "$app"
grep -Fq '.splan-contact-grid { display: flex; width: 1320px; align-items: center; gap: 32px; margin-top: 40px; }' "$styles"
grep -Fq '.splan-contact-carousel__track .splan-card { width: calc((100% - 96px) / 4);' "$styles"
grep -Fq 'data-splan-contact-prev' "$app"
grep -Fq 'data-splan-contact-next' "$app"
grep -Fq 'contactTrack.append(contactTrack.firstElementChild)' "$app"
grep -Fq 'contactTrack.prepend(contactTrack.lastElementChild)' "$app"
grep -Fq '{ serial: "TSQ-Z-12347", contact: "Gerard Campbell" }' "$app"
grep -Fq '{ serial: "TSQ-Z-12348", contact: "Molly Hartman" }' "$app"
grep -Fq '{ serial: "TSQ-Z-12349", contact: "Jon Doe" }' "$app"
grep -Fq 'return contacts.size > 1 ? "Multiple"' "$app"
grep -Fq 'instrumentCount: servicePlanContactInstrumentCount(contact.name)' "$app"
grep -Fq 'return planTotal + 1;' "$app"
grep -Fq 'return plan.items.length;' "$app"
grep -Fq '${child ? "" : `<input type="checkbox" aria-label="Select ${instrument.serial}" data-splan-check data-splan-selection-id="${selectionId}" />`}' "$app"
grep -Fq 'data-splan-remove-contact="${contact.email}"' "$app"
grep -Fq 'removedServicePlanContacts.add(contact.name)' "$app"
grep -Fq 'servicePlanPlansByContactState(false)' "$app"
grep -Fq 'servicePlanContactPlanMarkup(plan, { withoutContact: true })' "$app"
grep -Fq 'const SERVICE_PLAN_NO_PLAN = Object.freeze({' "$app"
grep -Fq 'return [...SERVICE_PLAN_CONTACT_PLANS, ...SERVICE_PLAN_WITHOUT_CONTACT_PLANS, SERVICE_PLAN_NO_PLAN];' "$app"
grep -Fq 'withoutContactRows.innerHTML = renderedWithoutPlans.map' "$app"
grep -Fq 'let mostRecentlyCreatedServicePlanContactEmail = "";' "$app"
grep -Fq 'const newlyCreatedContactEmail = confirmedContactEmails.find' "$app"
grep -Fq 'activeContacts.unshift(activeContacts.splice(newlyCreatedContactIndex, 1)[0]);' "$app"
grep -Fq 'withoutContactGroup.hidden = withoutContactCount === 0;' "$app"
grep -Fq 'group.hidden = group.dataset.splanEmpty === "true";' "$app"
grep -Fq 'const visibleContactGroups = [contactGroup, withoutContactGroup].filter((group) => !group.hidden);' "$app"
grep -Fq 'if (visibleContactGroups.length === 1) setServicePlanGroupExpanded(visibleContactGroups[0], true);' "$app"

if sed -n '/<template id="service-plan-contacts-native-template">/,/<template id="contact-page-native-template">/p' "$repo_dir/index.html" | grep -Eiq 'Sebasti(a|e)n Martin'; then
  echo "Sebastian Martin must not appear as a service plan contact." >&2
  exit 1
fi

echo "Service plan contacts render five contact cards and five collapsed plans with data-driven instrument counts."
