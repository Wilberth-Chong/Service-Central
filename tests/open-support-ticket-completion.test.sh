#!/usr/bin/env bash
set -euo pipefail

test -f ticket-step-viewer.js
rg -q 'open-support-ticket-contact' app.js
rg -q 'open-support-ticket-review' app.js
rg -q 'id="open-support-ticket-contact-template"' index.html
rg -q 'id="open-support-ticket-review-template"' index.html
rg -Fq 'TicketStepViewer?.mount' app.js
rg -q 'data-ost-contact-field' index.html
rg -Fq '<span>First name <b>*</b></span>' index.html
rg -Fq '<span>Last name <b>*</b></span>' index.html
rg -Fq 'firstName: "Molly", lastName: "Hartman"' app.js
rg -Fq 'inputmode="numeric" pattern="[0-9]*"' index.html
rg -Fq 'field.value = field.value.replace(/\D/g, "");' app.js
rg -Fq '^[^\s@]+@[^\s@]+\.[^\s@]+$' app.js
rg -q 'data-ost-review-subject' index.html
rg -q 'data-ost-review-instrument-image' index.html
rg -q 'data-ost-review-files' index.html
rg -q 'data-ost-review-files-toggle' index.html
rg -q 'data-ost-review-files-list' index.html
rg -Fq '<dt>Problem</dt>' index.html
rg -Fq '<dt>Error codes</dt>' index.html
rg -Fq '<dt>Recent changes to the instrument or environment</dt>' index.html
rg -Fq '<dt>Name</dt>' index.html
rg -Fq '<section class="isd-instrument ost-review-instrument">' index.html
rg -Fq '<div class="isd-instrument__panel"><img data-ost-review-instrument-image' index.html
rg -Fq 'data-ost-review-errors' app.js
rg -Fq 'data-ost-review-files' app.js
rg -Fq 'data-ost-review-files-toggle' app.js
rg -Fq 'data-ost-review-files-list' app.js
rg -Fq 'const filesSection = app.querySelector(".ost-review-files");' app.js
rg -Fq 'filesSection.hidden = attachedFiles.length === 0;' app.js
rg -Fq 'filesList.className = "ost-review-files__grid isd-files";' app.js
rg -Fq 'chevron right/size=16px, style=mono.svg' app.js
rg -Fq 'ost-review-file__preview-frame' app.js
rg -Fq 'filesList.className = "ost-review-files__grid isd-files";' app.js
rg -Fq 'ost-review-file--preview' app.js
rg -Fq '.ost-review-instrument.isd-instrument > .isd-instrument__panel' styles.css
rg -Fq '.ost-review-instrument + .ost-review-card { margin-top: 40px; }' styles.css
rg -Fq '.ost-review-details--contact { column-gap: 40px; }' styles.css
rg -Fq '.screen--open-support-ticket-review .platform-sidebar' styles.css
rg -Fq '.screen--open-support-ticket-contact .platform-sidebar' styles.css
rg -Fq '.ost-review-files__grid' styles.css
rg -Fq 'font: 400 18px/26px "Helvetica Neue", Helvetica, Arial, sans-serif;' styles.css
rg -Fq '.ost-review-files button img { width: 24px; height: 24px; order: 1; }' styles.css
rg -Fq '.ost-review-files__grid.isd-files { margin-top: 16px !important; }' styles.css
rg -Fq '.ost-review-file__preview-frame' styles.css
rg -q '\.iss-steps \.is-complete > span:first-child' styles.css
rg -q 'border: 2px solid var\(--mi-red\)' styles.css
rg -Fq '[0, 300, 600, 900][currentStep - 1] - 18' ticket-step-viewer.js
rg -Fq '.iss-steps li:last-child { justify-items: start; text-align: left; }' styles.css
rg -Fq 'width: 1320px' styles.css
rg -Fq 'grid-template-columns: 300px 300px 300px 1fr' styles.css
rg -Fq 'margin: 28px 40px 34px' styles.css
rg -Fq 'width: min(882px, calc(100% - 36px))' styles.css
rg -Fq 'font: 400 18px/20px "Helvetica Neue", Helvetica, Arial, sans-serif' styles.css
rg -Fq 'font: 400 16px/20px "Helvetica Neue", Helvetica, Arial, sans-serif' styles.css
rg -Fq 'placeholder="Provide more details about your request and any troubleshooting steps you have already taken."' index.html
rg -Fq 'placeholder="Provide error codes or error messages."' index.html
rg -Fq '.isd-filled-files[hidden] { display: none; }' styles.css
rg -Fq 'class="isd-instrument__panel"' index.html
rg -Fq '<dt>Catalog name</dt>' index.html
rg -Fq '<dt>Groups</dt>' index.html
rg -Fq '<dt>Notes</dt>' index.html
rg -Fq '<dt>Contract Number</dt>' index.html
rg -Fq "What&#39;s included in the Essential Service Plan" index.html
rg -Fq 'grid-column: 2;' styles.css
rg -Fq 'gap: 40px 26px !important' styles.css
rg -Fq 'grid-template-columns: 160px 160px 160px minmax(0, 1fr) !important' styles.css
rg -Fq '<li>Preventative maintenance</li><li>Corrective maintenance</li>' index.html
rg -Fq 'grid-template-columns: 1fr;' styles.css
rg -Fq '.isd-coverage__facts > span { display: inline-flex; height: 24px;' styles.css
rg -Fq 'color: #145c2a; background: #d7f7df;' styles.css
rg -Fq 'uploadedFiles = [...uploadedFiles, ...nextFiles].slice(0, 5);' app.js
rg -Fq 'URL.createObjectURL(file)' app.js
rg -Fq 'isd-file--preview' app.js
rg -Fq 'isd-file__preview-frame' app.js
rg -Fq 'isd-file__meta' app.js
rg -Fq 'assets/icons/documents/CSV/Size=32px, Style=Bold.svg' app.js
rg -Fq 'assets/icons/actions/bin/size=16px, style=mono.svg' app.js
rg -Fq 'grid-template-columns: repeat(3, minmax(0, 1fr));' styles.css
rg -Fq '.isd-file__preview-frame {' styles.css
rg -Fq '.isd-file__meta {' styles.css
rg -Fq 'padding: 24px;' styles.css
rg -Fq 'width: 160px; height: 90px;' styles.css
rg -Fq 'font: 400 12px/16px "Helvetica Neue", Helvetica, Arial, sans-serif;' styles.css
rg -Fq 'gap: 16px !important;' styles.css
rg -Fq 'grid-template-rows: 90px auto 16px; gap: 4px;' styles.css
rg -Fq 'margin-left: auto;' styles.css
rg -Fq '.isd-file__meta { display: flex; min-width: 0; align-items: flex-start; gap: 8px;' styles.css
rg -Fq '.isd-files { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px !important; box-sizing: border-box; border: 1px solid #ccc; border-radius: 3px;' styles.css
rg -Fq '.isd-files article .isd-file__meta button { position: static;' styles.css
rg -Fq '.isd-file__meta > span { display: block; min-width: 0; flex: 1; color: #1b1b1d; line-height: 16px; white-space: normal;' styles.css
rg -Fq 'filledFiles.hidden = uploadedFiles.length === 0;' app.js

printf 'PASS: completed support ticket flow is wired\n'
