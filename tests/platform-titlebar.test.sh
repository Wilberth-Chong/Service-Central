#!/usr/bin/env bash
set -euo pipefail

test -f platform-titlebar.js

rg -Fq 'window.PlatformTitlebar' platform-titlebar.js
rg -Fq 'wire(root = document)' platform-titlebar.js
rg -Fq '[data-platform-titlebar]' platform-titlebar.js
rg -Fq 'requestAnimationFrame' platform-titlebar.js
rg -Fq 'scrollTop > 0' platform-titlebar.js
rg -Fq 'is-platform-titlebar-compact' platform-titlebar.js
rg -Fq 'addEventListener("scroll", update, { passive: true })' platform-titlebar.js
rg -Fq 'platform-titlebar__go-top' platform-titlebar.js
rg -Fq 'Go to top' platform-titlebar.js
rg -Fq 'scrollContainer.scrollTo({ top: 0, behavior: "smooth" })' platform-titlebar.js
rg -Fq 'titlebar.closest(".platform-page-body, .mi-main")' platform-titlebar.js
rg -Fq 'titlebar.prepend(button);' platform-titlebar.js

rg -Fq '<script src="platform-titlebar.js?v=20260826-titlebar-contact-left"></script>' index.html
rg -Fq 'window.PlatformTitlebar?.wire(app);' app.js
rg -Fq 'function isSupportFlowTitlebarRoute(route)' app.js
rg -Fq 'route === "pm-request-summary"' app.js
rg -Fq 'route === "serviceplan-summary"' app.js
rg -Fq 'route === "qualification-summary"' app.js
rg -Fq 'route === "calibration-summary"' app.js
rg -Fq 'route.startsWith("open-support-ticket")' app.js
rg -Fq 'route.startsWith("request-pm")' app.js
rg -Fq 'route.startsWith("request-serviceplan")' app.js
rg -Fq 'route.startsWith("request-qualification")' app.js
rg -Fq 'route.startsWith("request-calibration")' app.js
rg -Fq 'titlebar.dataset.platformTitlebar = "";' app.js

test "$(rg -o 'data-platform-titlebar' index.html app.js | wc -l | tr -d ' ')" -eq 14

rg -Fq 'class="mi-titlebar db-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar ai-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar sh-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar rs-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar cons-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar ins-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="shell-detail-hero" data-platform-titlebar' index.html
rg -Fq 'class="ifaq-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar spc-title-band" data-platform-titlebar' index.html
rg -Fq 'class="mi-titlebar contact-titlebar" data-platform-titlebar' index.html
rg -Fq 'class="mi-button contact-scheduling-support" type="button" disabled>Scheduling Support</button>' index.html
rg -Fq 'class="splan-top" data-platform-titlebar' index.html
rg -Fq '<h1 data-platform-go-top-anchor>Service plan contacts</h1>' index.html
rg -Fq 'class="id-hero" data-platform-titlebar' app.js
rg -Fq 'class="sd-hero" data-platform-titlebar' app.js

rg -Fq '[data-platform-titlebar] {' styles.css
rg -Fq 'position: sticky;' styles.css
rg -Fq 'z-index: 50;' styles.css
rg -Fq '.is-platform-titlebar-compact > [data-platform-titlebar] {' styles.css
rg -Fq 'height: 56px;' styles.css
rg -Fq 'padding: 13px 32px;' styles.css
compact_rule=$(awk '/^\.is-platform-titlebar-compact > \[data-platform-titlebar\] \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$compact_rule" | rg -Fq 'display: flex;'
rg -Fq '.is-platform-titlebar-compact > [data-platform-titlebar] h1 {' styles.css
rg -Fq 'font-size: 20px;' styles.css
button_rule=$(awk '/^\.platform-page-body\.is-platform-titlebar-compact > \[data-platform-titlebar\] \.mi-button \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$button_rule" | rg -Fq 'height: 30px;'
printf '%s\n' "$button_rule" | rg -Fq 'padding: 0 40px;'
rg -Fq '[data-platform-titlebar] .platform-titlebar__go-top {' styles.css
rg -Fq 'color: var(--Global-Colors-Primary-Blue---Blue-40, #0071d0);' styles.css
rg -Fq '.is-platform-titlebar-compact > [data-platform-titlebar] .platform-titlebar__go-top {' styles.css
no_title_rule=$(awk '/^\.is-platform-titlebar-compact > \[data-platform-titlebar\]\.platform-titlebar--without-title > \.platform-titlebar__go-top \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$no_title_rule" | rg -Fq 'margin-left: 0;'
rg -Fq '.contact-scheduling-support {' styles.css
rg -Fq '.contact-scheduling-support:disabled {' styles.css
rg -Fq '.is-platform-titlebar-compact > .id-hero {' styles.css
instrument_actions_rule=$(awk '/^\.is-platform-titlebar-compact > \.id-hero \.id-hero__actions \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$instrument_actions_rule" | rg -Fq 'margin-left: auto;'
rg -Fq '.is-platform-titlebar-compact > .sd-hero {' styles.css
rg -Fq '.is-platform-titlebar-compact > .ifaq-titlebar .ifaq-heading > button {' styles.css
rg -Fq '.is-platform-titlebar-compact > .ifaq-titlebar {' styles.css
rg -Fq 'justify-content: flex-start;' styles.css
rg -Fq '.is-platform-titlebar-compact > .ifaq-titlebar .ifaq-title-actions {' styles.css
rg -Fq '.is-platform-titlebar-compact > .ins-titlebar {' styles.css
rg -Fq '.is-platform-titlebar-compact > .ins-titlebar .ins-title-actions {' styles.css
splan_heading_rule=$(awk '/^\.is-platform-titlebar-compact > \.splan-top \.splan-heading \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$splan_heading_rule" | rg -Fq 'width: 100%;'
printf '%s\n' "$splan_heading_rule" | rg -Fq 'align-items: center;'
rg -Fq '.is-platform-titlebar-compact > .splan-top .splan-heading > div {' styles.css
rg -Fq '.is-platform-titlebar-compact > .splan-top .splan-heading p,' styles.css
rg -Fq '.is-platform-titlebar-compact > .splan-top .splan-contact-grid {' styles.css
shell_rule=$(awk '/^\.is-platform-titlebar-compact > \.shell-detail-hero \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$shell_rule" | rg -Fq 'display: flex;'
shell_summary_rule=$(awk '/^\.is-platform-titlebar-compact > \.shell-detail-hero \.shell-detail-summary \{/{capture=1} capture{print} capture && /^}/{exit}' styles.css)
printf '%s\n' "$shell_summary_rule" | rg -Fq 'display: none;'

printf 'PASS: shared platform titlebar behavior and route coverage are wired\n'
