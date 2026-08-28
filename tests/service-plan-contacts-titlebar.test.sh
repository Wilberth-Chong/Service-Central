#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'data-platform-titlebar-trigger=".splan-contact-grid"' "$repo_dir/index.html"
grep -Fq 'platform-titlebar.js?v=20260827-splan-deferred-titlebar' "$repo_dir/index.html"
grep -Fq 'function wireDeferredTitlebar(titlebar, scrollContainer, triggerSelector)' "$repo_dir/platform-titlebar.js"
grep -Fq 'trigger.getBoundingClientRect().bottom <= scrollContainer.getBoundingClientRect().top' "$repo_dir/platform-titlebar.js"
grep -Fq 'clone.classList.toggle("is-visible", triggerIsOutOfView)' "$repo_dir/platform-titlebar.js"
grep -Fq '.platform-titlebar--deferred-source[data-platform-titlebar]' "$repo_dir/styles.css"
grep -Fq '.platform-titlebar__deferred.is-visible' "$repo_dir/styles.css"

if grep -Fq '.screen--service-plan-contacts .splan-main::after' "$repo_dir/styles.css"; then
  echo "The Service plan contacts page should preserve its original section instead of adding scroll clearance." >&2
  exit 1
fi

echo "Service plan contacts titlebar waits until the contact cards leave the viewport."
