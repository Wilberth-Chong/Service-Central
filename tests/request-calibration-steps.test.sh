#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'const calibrationRequestDraft' app.js
rg -Fq 'function renderRequestCalibrationDetails()' app.js
rg -Fq 'function renderRequestCalibrationContact()' app.js
rg -Fq 'function renderRequestCalibrationReview()' app.js
rg -Fq 'function renderCalibrationSummary()' app.js
rg -Fq 'function prepareCalibrationStepOne()' app.js
rg -Fq 'data-calibration-applied-filters' app.js
awk '/function wireRequestCalibration\(\)/,/^function prepareCalibrationStepOne/' app.js | rg -Fq 'options: options.length ? options : ["—"]'
rg -Fq 'data-calibration-instrument-image' app.js
rg -Fq '.calibration-table input[type="checkbox"]:checked' styles.css
awk '/function renderRequestCalibrationReview\(\)/,/^function renderCalibrationSummary/' app.js | rg -Fq '"request-calibration-contact", false'
rg -Fq 'setRoute("request-calibration-details")' app.js
rg -Fq 'setRoute("calibration-summary")' app.js
rg -Fq '"request-calibration-details"' app.js
rg -Fq '"request-calibration-contact"' app.js
rg -Fq '"request-calibration-review"' app.js
rg -Fq '"calibration-summary"' app.js

printf 'PASS: calibration steps 1–4 and submitted summary routes are present\n'
