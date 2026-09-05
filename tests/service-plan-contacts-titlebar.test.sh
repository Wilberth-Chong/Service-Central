#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'data-platform-titlebar-trigger=".splan-primary"' "$repo_dir/index.html"
grep -Fq 'platform-titlebar.js?v=20260831-detail-hero-titlebar-v3' "$repo_dir/index.html"
grep -Fq 'function wireStickyTitlebar(titlebar, scrollContainer, triggerSelector)' "$repo_dir/platform-titlebar.js"
grep -Fq 'const triggerIsOutOfView = triggerRect.bottom <= scrollContainer.getBoundingClientRect().top;' "$repo_dir/platform-titlebar.js"
grep -Fq 'host.classList.toggle("is-visible", triggerIsOutOfView)' "$repo_dir/platform-titlebar.js"
grep -Fq '.platform-titlebar__sticky-host.is-visible' "$repo_dir/styles.css"
grep -Fq '.splan-top.platform-titlebar__deferred .splan-primary' "$repo_dir/styles.css"
grep -Fq 'height: 32px !important;' "$repo_dir/styles.css"
grep -Fq 'padding-right: 16px !important;' "$repo_dir/styles.css"
grep -Fq 'padding-left: 16px !important;' "$repo_dir/styles.css"

if grep -Fq '.screen--service-plan-contacts .splan-main::after' "$repo_dir/styles.css"; then
  echo "The Service plan contacts page should preserve its original section instead of adding scroll clearance." >&2
  exit 1
fi

echo "Service plan contacts titlebar appears as soon as the primary CTA leaves the viewport."
