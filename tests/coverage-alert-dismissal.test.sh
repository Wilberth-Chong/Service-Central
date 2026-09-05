#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'let miCoverageAlertDismissed = false;' "$root_dir/app.js"
grep -Fq 'miCoverageAlertDismissed = true;' "$root_dir/app.js"
grep -Fq 'app.querySelector("[data-mi-coverage]")?.setAttribute("hidden", "");' "$root_dir/app.js"
grep -Fq 'if (miCoverageAlertDismissed) app.querySelector("[data-mi-coverage]")?.setAttribute("hidden", "");' "$root_dir/app.js"
grep -Fq '.mi-coverage-button[hidden] { display: none !important; }' "$root_dir/styles.css"
if grep -Fq 'showToast("Coverage alert dismissed")' "$root_dir/app.js"; then
  echo "Coverage alert dismissal must not show a toast." >&2
  exit 1
fi

echo "Coverage alert dismissal checks passed."
