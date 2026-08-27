#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

rg -Fq 'services-central-whats-new-q3-2026-dismissed' "$root/app.js"
rg -Fq 'showWhatsNew' "$root/app.js"
rg -Fq 'New on Services Central' "$root/app.js"
rg -Fq 'Multiple service plan contacts' "$root/app.js"
rg -Fq 'More support request visibility' "$root/app.js"
rg -Fq 'assets/icons/users/user add/Size=24px, Style=Mono.svg' "$root/app.js"
rg -Fq 'assets/icons/navigation/support/size=24px, style=mono.svg' "$root/app.js"
whats_new_modal="$(sed -n '/function showWhatsNewIfNeeded()/,/^}/p' "$root/app.js")"
printf '%s\n' "$whats_new_modal" | rg -Fq 'closeIcon: "assets/icons/actions/close/size=24px, style=mono.svg"'
rg -Fq 'whats-new-dialog' "$root/styles.css"
rg -Fq 'let whatsNewEligibleAfterSignIn = false' "$root/app.js"
rg -Fq 'whatsNewEligibleAfterSignIn = true;' "$root/app.js"
rg -Fq 'if (!whatsNewEligibleAfterSignIn) return false;' "$root/app.js"
rg -Uq '\.whats-new-dialog \.modal__title \{[\s\S]*?font-weight: 300;' "$root/styles.css"
rg -Uq '\.whats-new__feature h3 \{[\s\S]*?font-size: 22px;[\s\S]*?font-weight: 700;' "$root/styles.css"
rg -Uq '\.whats-new__feature p \{[\s\S]*?font-size: 20px;[\s\S]*?font-weight: 400;' "$root/styles.css"
rg -Uq '\.whats-new__preference span \{[\s\S]*?font-size: 14px;[\s\S]*?font-weight: 500;' "$root/styles.css"
