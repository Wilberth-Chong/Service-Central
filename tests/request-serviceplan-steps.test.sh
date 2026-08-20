#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'const servicePlanRequestDraft' app.js
rg -Fq 'coverageNeeds: { downtime: "", priorities: [] }' app.js
rg -Fq 'function renderRequestServicePlanDetails()' app.js
rg -Fq 'function renderRequestServicePlanContact()' app.js
rg -Fq 'function renderRequestServicePlanReview()' app.js
rg -Fq 'function renderServicePlanSummary()' app.js
rg -Fq 'setRoute("request-serviceplan-details")' app.js
rg -Fq 'setRoute("request-serviceplan-contact")' app.js
rg -Fq 'setRoute("request-serviceplan-review")' app.js
rg -Fq 'setRoute("serviceplan-summary")' app.js
rg -Fq 'Service coverage needs' app.js
rg -Fq 'data-serviceplan-downtime' app.js
rg -Fq 'data-serviceplan-priority' app.js
rg -Fq 'fillServicePlanReview(app, "qualification-summary")' app.js
awk '/function renderServicePlanSummary\(\)/,/^function renderRequestQualification/' app.js | rg -Fq 'data-serviceplan-summary-contact-note'
awk '/function renderServicePlanSummary\(\)/,/^function renderRequestQualification/' app.js | rg -Fq 'data-route="service-plan-contacts"'
rg -Fq '.service-plan-coverage-needs' styles.css
rg -Fq 'function prepareServicePlanStepOne()' app.js
rg -Fq 'data-serviceplan-select-all-table' app.js
rg -Fq 'data-serviceplan-applied-filters' app.js
rg -Fq 'data-serviceplan-page-size-menu' app.js
rg -Fq 'Select all 240 instruments' app.js
rg -Fq 'data-serviceplan-system-toggle' app.js
awk '/function prepareServicePlanStepOne\(\)/,/^function renderRequestServicePlan/' app.js | rg -Fq 'assets/icons/general/in systems/size=24px, style=mono.svg'
rg -Fq 'const collapsibleRows = rows.slice(0, 5);' app.js
rg -Fq 'system: collapsibleRows.includes(row)' app.js
rg -Fq '.screen--request-serviceplan .serviceplan-table input[type="checkbox"]' styles.css
rg -Fq 'class="serviceplan-card"' index.html
rg -Fq '.screen--request-serviceplan .serviceplan-card' styles.css
rg -Fq '.service-plan-coverage-needs__choices input[type="radio"]:checked { border-color: var(--mi-blue); background: #fff; }' styles.css
rg -Fq '.screen--request-serviceplan-details .service-plan-coverage-needs input[type="checkbox"]:checked' styles.css
rg -Fq '.screen--request-pm .pm-content input[type="checkbox"]' styles.css
rg -Fq '.screen--request-serviceplan .serviceplan-table input[type="checkbox"]:indeterminate' styles.css
rg -Fq '.pm-status { display: inline-flex; min-height: 22px; align-items: center; border-radius: 12px; padding: 0 10px; font-size: 14px; font-weight: 500; }' styles.css
if rg -Fq '.service-plan-coverage-needs__choices input[type="checkbox"]::before' styles.css; then
  printf 'FAIL: Service coverage checkboxes must use the shared Komodo checkmark.\n' >&2
  exit 1
fi

printf 'PASS: service plan steps 1–4 and submitted summary routes are present\n'
