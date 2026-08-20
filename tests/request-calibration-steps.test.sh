#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'const calibrationRequestDraft' app.js
rg -Fq 'serviceNeeds: { level: "", interval: "" }' app.js
rg -Fq 'function renderRequestCalibrationDetails()' app.js
rg -Fq 'function renderRequestCalibrationContact()' app.js
rg -Fq 'function renderRequestCalibrationReview()' app.js
rg -Fq 'function renderCalibrationSummary()' app.js
rg -Fq 'function prepareCalibrationStepOne()' app.js
rg -Fq 'data-calibration-applied-filters' app.js
awk '/function wireRequestCalibration\(\)/,/^function prepareCalibrationStepOne/' app.js | rg -Fq 'options: options.length ? options : ["—"]'
rg -Fq 'data-calibration-instrument-image' app.js
rg -Fq '.calibration-table input[type="checkbox"]:checked' styles.css
rg -Fq '.calibration-table input[type="checkbox"]:indeterminate' styles.css
awk '/function wireRequestCalibration\(\)/,/^function prepareCalibrationStepOne/' app.js | rg -Fq 'data-calibration-page-size-option'
awk '/function prepareCalibrationStepOne\(\)/,/^function renderRequestCalibration\(\)/' app.js | rg -Fq 'calibrationPageSizeMenu'
rg -Fq '.screen--request-calibration .qualification-select-all' styles.css
rg -Fq '.screen--request-calibration .pm-content, .screen--request-qualification .pm-content' styles.css
awk '/function renderRequestCalibrationReview\(\)/,/^function renderCalibrationSummary/' app.js | rg -Fq '"request-calibration-contact", false'
rg -Fq 'setRoute("request-calibration-details")' app.js
rg -Fq 'setRoute("calibration-summary")' app.js
rg -Fq '"request-calibration-details"' app.js
rg -Fq '"request-calibration-contact"' app.js
rg -Fq '"request-calibration-review"' app.js
rg -Fq '"calibration-summary"' app.js
awk '/function wireCalibrationDetails\(\)/,/^function renderRequestCalibrationDetails/' app.js | rg -Fq 'Calibration service needs'
awk '/function wireCalibrationDetails\(\)/,/^function renderRequestCalibrationDetails/' app.js | rg -Fq 'data-calibration-service-level'
awk '/function wireCalibrationDetails\(\)/,/^function renderRequestCalibrationDetails/' app.js | rg -Fq 'data-calibration-interval'
rg -Fq '.screen--request-calibration-details .calibration-service-needs' styles.css
rg -Fq '.calibration-service-needs__choices label { cursor: pointer;' styles.css
rg -Fq '.calibration-service-needs__choices input { appearance: none; cursor: pointer;' styles.css
rg -Fq '.calibration-service-needs__choices input { appearance: none;' styles.css
rg -Fq '.calibration-service-needs__choices input:checked::before' styles.css
rg -Fq '.calibration-service-needs__choices { display: grid; gap: 18px;' styles.css
rg -Fq '.calibration-service-needs__choices { display: grid; gap: 18px; margin-top: 12px;' styles.css
rg -Fq '.calibration-service-needs__choices label { cursor: pointer; display: inline-flex; align-items: center; gap: 12px;' styles.css
rg -Fq 'const CALIBRATION_EUROPEAN_COUNTRIES' app.js
awk '/function wireCalibrationContact\(\)/,/^function renderRequestCalibrationContact/' app.js | rg -Fq 'CALIBRATION_SUPPORTED_COUNTRIES'
awk '/function wireCalibrationContact\(\)/,/^function renderRequestCalibrationContact/' app.js | rg -Fq 'Not applicable'
awk '/function wireCalibrationContact\(\)/,/^function renderRequestCalibrationContact/' app.js | rg -Fq 'country.addEventListener("change", updateStates)'
rg -Fq 'class KomodoSingleSelect' app.js
awk '/function wireCalibrationContact\(\)/,/^function renderRequestCalibrationContact/' app.js | rg -Fq 'new KomodoSingleSelect(country)'
! awk '/class KomodoSingleSelect/,/^function wireCalibrationContact/' app.js | rg -Fq 'assets/icons/actions/checkmark/size=16px, style=bold.svg'
rg -Fq '.komodo-single-select__trigger' styles.css
rg -Fq '.komodo-single-select__menu' styles.css
rg -Fq 'function insertCalibrationReviewServiceNeeds' app.js
rg -Fq 'Calibration service needs' app.js
rg -Fq 'data-calibration-review-service-level' app.js
rg -Fq 'data-calibration-review-interval' app.js
awk '/function renderRequestCalibrationReview\(\)/,/^function renderCalibrationSummary/' app.js | rg -Fq 'insertCalibrationReviewServiceNeeds(app)'
awk '/function renderCalibrationSummary\(\)/,/^function renderRequestInstallation/' app.js | rg -Fq 'insertCalibrationSummaryServiceNeeds(app)'
rg -Fq 'data-qualification-summary-name' index.html
rg -Fq 'data-qualification-summary-service-address' index.html
rg -Fq '.calibration-review-details--needs' styles.css
if rg -Fq '.ts-notice--submitted { display: flex; min-height: 124px;' styles.css; then
  printf 'FAIL: submitted notice has a fixed minimum height\n' >&2
  exit 1
fi
rg -Fq 'data-${prefix}-name' app.js
rg -Fq 'data-${prefix}-service-address' app.js

printf 'PASS: calibration steps 1–4 and submitted summary routes are present\n'
