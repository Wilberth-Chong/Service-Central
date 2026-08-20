#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'const qualificationRequestDraft' app.js
rg -Fq 'function renderRequestQualificationDetails()' app.js
rg -Fq 'function renderRequestQualificationContact()' app.js
rg -Fq 'function renderRequestQualificationReview()' app.js
rg -Fq 'setRoute("request-qualification-details")' app.js
rg -Fq 'request-qualification-details-template' index.html
rg -Fq 'request-qualification-contact-template' index.html
rg -Fq 'request-qualification-review-template' index.html
rg -Fq 'data-qualification-selected-toggle' index.html
rg -Fq 'data-qualification-contact-field="phone"' index.html
rg -Fq 'data-qualification-contact-field="country"' index.html
rg -Fq 'data-qualification-contact-field="state"' index.html
rg -Fq 'data-qualification-contact-field="city"' index.html
rg -Fq 'data-qualification-contact-field="city" type="text"' index.html
awk '/function wireRequestQualificationContact\(\)/,/^function renderRequestQualificationContact/' app.js | rg -Fq 'new KomodoSingleSelect(country)'
awk '/function wireRequestQualificationContact\(\)/,/^function renderRequestQualificationContact/' app.js | rg -Fq 'new KomodoSingleSelect(state)'
rg -Fq 'const CALIBRATION_SUPPORTED_COUNTRIES' app.js
awk '/function wireRequestQualificationContact\(\)/,/^function renderRequestQualificationContact/' app.js | rg -Fq 'CALIBRATION_SUPPORTED_COUNTRIES'
awk '/function wireRequestQualificationContact\(\)/,/^function renderRequestQualificationContact/' app.js | rg -Fq 'CALIBRATION_US_STATES'
awk '/function wireRequestQualificationContact\(\)/,/^function renderRequestQualificationContact/' app.js | rg -Fq 'CALIBRATION_CANADIAN_PROVINCES'
rg -Fq 'value="Molly"' index.html
rg -Fq 'value="molly.hartman@thermofisher.com"' index.html
rg -Fq 'qualification-contact-grid__identity' styles.css
rg -Fq 'const defaultQualificationContact' app.js
rg -Fq 'data-qualification-review-details' index.html
rg -Fq 'data-qualification-review-service-address' index.html
awk '/function renderQualificationSummary\(\)/,/^function wireRequestCalibration/' app.js | rg -Fq 'data-qualification-summary-name'
awk '/function renderQualificationSummary\(\)/,/^function wireRequestCalibration/' app.js | rg -Fq 'data-qualification-summary-service-address'
awk '/function renderQualificationSummary\(\)/,/^function wireRequestCalibration/' app.js | rg -Fq 'closeOnly: true'
rg -Fq 'qualification-review-details--contact' styles.css
rg -Fq 'formatQualificationServiceAddress' app.js
rg -Fq '.screen--request-qualification-contact .platform-sidebar' styles.css
rg -Fq '.screen--request-qualification-review .platform-sidebar' styles.css
rg -Fq 'screen--request-qualification-details' styles.css
awk '/function prepareQualificationStepOne\(\)/,/^function renderRequestQualification/' app.js | rg -Fq 'assets/icons/general/in systems/size=24px, style=mono.svg'
rg -Fq 'qualification-selected-table' app.js
rg -Fq 'Hide selected instrument(s)' app.js
rg -Fq 'qualification-selected-table__system-icon' app.js
rg -Fq '.qualification-selected-table' styles.css
rg -Fq 'font: 500 18px/26px' styles.css
rg -Fq 'font: 400 14px/20px' styles.css
rg -Fq 'order: -1' styles.css
rg -Fq 'color: #1b1b1d' styles.css
rg -Fq 'width: min(560px, 100%)' styles.css
rg -Fq '"request-qualification-details": {' app.js
rg -Fq '"request-qualification-contact": {' app.js
rg -Fq '"request-qualification-review": {' app.js
awk '/function wireRequestQualification\(\)/,/^function renderRequestQualification\(\)/' app.js | rg -Fq 'setRoute("request-qualification-details")'
! awk '/function wireRequestServicePlan\(\)/,/^function renderRequestServicePlan\(\)/' app.js | rg -Fq 'request-qualification-details'

printf 'PASS: qualification steps 2–4 routes, templates, and controls are present\n'
