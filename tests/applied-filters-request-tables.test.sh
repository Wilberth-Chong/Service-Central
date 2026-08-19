#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'data-iss-applied-filters' index.html
rg -Fq 'data-qualification-applied-filters' app.js
rg -Fq 'controlHost, menuStyle: "figma-column"' app.js
rg -Fq 'data-iss-clear-filters' app.js
rg -Fq 'data-qualification-clear-filters' app.js
rg -Fq 'data-iss-applied-badges' index.html
rg -Fq 'data-qualification-applied-badges' app.js
rg -Fq 'appliedBadges.append(host);' app.js
rg -Fq 'appearance: auto; accent-color: var(--mi-blue);' styles.css
rg -Fq '.screen--request-qualification .qualification-select-all { margin-bottom: 0;' styles.css
rg -Fq '.iss-applied-filters { width: 100%; align-items: center; gap: 0; margin-top: 16px; }' styles.css
rg -Fq '.iss-applied-filters[hidden] { display: none; }' styles.css
rg -Fq '.iss-applied-filters .msf__applied { margin-top: 0; }' styles.css
rg -Fq '.iss-applied-filters .sh-clear-filters { align-self: center; margin-top: 0; }' styles.css
rg -Fq '.iss-table-wrap + .iss-pagination { margin-top: 12px; }' styles.css

printf 'PASS: request table applied filters and qualification checkbox treatment are wired\n'
