#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'placeholder="Search by instrument serial number, nickname, ticket number, or subject"' index.html
rg -Fq '.screen--support-history .platform-sidebar.is-collapsed + .sh-main { margin-left: 56px; }' styles.css
rg -Fq '.sh-titlebar { height: 88px; align-items: center; justify-content: space-between; padding: 0 32px; }' styles.css
rg -Fq '.sh-content { width: 1320px; margin: 48px 32px 0; }' styles.css
rg -Fq '.sh-top { display: grid; grid-template-columns: 642px 243px 136px; grid-template-rows: 28px 67px; column-gap: 32px; row-gap: 40px; }' styles.css
rg -Fq '.sh-col-icon { width: 24px; }.sh-col-status { width: 113px; }.sh-col-ticket { width: 118px; }.sh-col-type { width: 120px; }.sh-col-subject { width: 103px; }.sh-col-systems { width: 40px; }.sh-col-serial { width: 108px; }.sh-col-model { width: 118px; }.sh-col-nickname { width: 118px; }.sh-col-groups { width: 113px; }.sh-col-contact { width: 113px; }.sh-col-created { width: 114px; }.sh-col-closed { width: 118px; }' styles.css
rg -Fq '.sh-table th, .sh-table td { height: 41px;' styles.css
rg -Fq '.sh-table th { height: 45px; font-weight: 500; }' styles.css
rg -Fq '.sh-table th > button > img { width: 16px; height: 16px; opacity: .28; }' styles.css
rg -Fq '<div class="sh-applied-filters" aria-label="Ticket filters">' index.html
rg -Fq '<div data-sh-status-filter></div>' index.html
rg -Fq '<th><div data-sh-status-filter-trigger></div></th>' index.html
! rg -Fq '.sh-filter-row' index.html styles.css
rg -Fq 'const statusFilter = new window.MultiSelectFilter(statusFilterRoot' app.js
rg -Fq 'controlHost: statusFilterTriggerRoot' app.js
rg -Fq '.sh-status { display: inline-flex; height: 23px; align-items: center; justify-content: center; border-radius: 12px;' styles.css
