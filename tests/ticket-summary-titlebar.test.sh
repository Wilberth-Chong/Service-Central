#!/usr/bin/env bash
set -euo pipefail

rg -Fq 'const anchor = titlebar.querySelector("[data-platform-go-top-anchor]");' platform-titlebar.js
rg -Fq 'anchor.insertAdjacentElement("afterend", button);' platform-titlebar.js

rg -Fq 'Boolean(TICKET_SUMMARIES[route])' app.js
rg -Fq 'app.querySelector(".iss-titlebar, .pm-titlebar, .ts-titlebar")' app.js
rg -Fq 'class="ts-titlebar__details"' app.js
rg -Fq 'class="ts-titlebar__metadata"' app.js
rg -Fq 'data-platform-go-top-anchor' app.js
rg -Fq '<strong>Ticket number:</strong> ${ticket.ticket}' app.js
rg -Fq '<strong>Ticket type:</strong> ${ticket.type}' app.js
rg -Fq 'class="ts-title-date"' app.js
rg -Fq '<span>Scheduled start date</span>' app.js

compact_rule=$(awk '/^\.is-platform-titlebar-compact > \.ts-titlebar \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$compact_rule" | rg -Fq 'display: flex;'
printf '%s\n' "$compact_rule" | rg -Fq 'height: 92px;'
printf '%s\n' "$compact_rule" | rg -Fq 'padding: 12px 48px;'
printf '%s\n' "$compact_rule" | rg -Fq 'justify-content: space-between;'
printf '%s\n' "$compact_rule" | rg -Fq 'align-items: flex-end;'

rg -Fq '.is-platform-titlebar-compact > .ts-titlebar h1 {' styles.css
rg -Fq 'font-size: var(--text-style-heading-h4-font-size, 20px);' styles.css
rg -Fq '.is-platform-titlebar-compact > .ts-titlebar .platform-titlebar__go-top {' styles.css
rg -Fq 'margin-left: 0;' styles.css
rg -Fq '.is-platform-titlebar-compact > .ts-titlebar .ts-state {' styles.css
rg -Fq 'padding: 1px 10px;' styles.css
badge_rule=$(awk '/^\.is-platform-titlebar-compact > \.ts-titlebar \.ts-state \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$badge_rule" | rg -Fq 'font-size: 14px;'
printf '%s\n' "$badge_rule" | rg -Fq 'width: max-content;'
printf '%s\n' "$badge_rule" | rg -Fq 'flex: 0 0 auto;'
printf '%s\n' "$badge_rule" | rg -Fq 'white-space: nowrap;'
rg -Fq '.is-platform-titlebar-compact > .ts-titlebar .ts-titlebar__metadata,' styles.css
rg -Fq 'font-size: 14px;' styles.css

printf 'PASS: support ticket summary uses the compact shared titlebar layout\n'
