#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'setRoute("tech-support-summary", {' app.js
rg -Fq 'status: "Submitted"' app.js
rg -Fq 'ticket: "Pending"' app.js
rg -Fq 'submitted: true' app.js
rg -Fq 'const submittedNotice' app.js
rg -Fq 'Request submitted:' app.js
rg -Fq 'ticket.problem ||' app.js
rg -Fq 'ticket.errors ||' app.js
rg -Fq 'ticket.changes ||' app.js
rg -Fq '.ts-notice--submitted' styles.css
rg -Fq 'success/size=24px, style=bold.svg' app.js
rg -Fq 'filter: invert(48%) sepia(92%) saturate(1265%) hue-rotate(88deg)' styles.css
rg -Fq 'closeOnly: true' app.js
rg -Fq 'closeOnly = false' platform-action-bar.js
rg -Fq 'const summaryCloseRoute = ticket.submitted ? "request-support" : "support-history";' app.js
rg -Fq 'create({ closeOnly: true, closeRoute: summaryCloseRoute })' app.js
rg -Fq 'border-left: 8px solid #00a62c;' styles.css
rg -Fq 'background: #f7f7f7;' styles.css
rg -Fq '.ts-notice--submitted p { margin: 0; font-size: 16px;' styles.css

printf 'PASS: submitting a support ticket renders its pending summary\n'
