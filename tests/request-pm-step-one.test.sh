#!/usr/bin/env bash
set -euo pipefail

# Regression: PM step one must use the shared four-step viewer and the
# Qualification-style instrument-selection controls, rather than its retired
# five-step-only table implementation.
pm_step_one=$(sed -n '/function wireRequestPm()/,/function wireRequestServicePlan()/p' app.js)

rg -Fq 'data-pm-applied-filters' - <<<"$pm_step_one"
rg -Fq 'data-pm-select-all-table' - <<<"$pm_step_one"
rg -Fq 'data-pm-filter-host' - <<<"$pm_step_one"
rg -Fq 'data-pm-page-size-menu' - <<<"$pm_step_one"

pm_template=$(sed -n '/<template id="request-pm-native-template">/,/<\/template>/p' index.html)
rg -Fq 'SN98362W' - <<<"$pm_template"
rg -Fq '<strong>267</strong>' - <<<"$pm_template"
! rg -q 'data-pm-instrument[^>]*checked' <<<"$pm_template"

pm_render=$(sed -n '/function renderRequestPm()/,/function wireRequestServicePlan()/p' app.js)
rg -Fq 'mountTicketStepViewer(1, {' - <<<"$pm_render"
rg -Fq 'ariaLabel: "PM scheduling request progress"' - <<<"$pm_render"
