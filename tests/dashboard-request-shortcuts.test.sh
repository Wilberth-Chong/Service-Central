#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Eq 'data-route="request-serviceplan"[^>]*><img src="assets/dashboard/shortcut-plan\.svg"' "$root_dir/index.html"
grep -Eq 'data-route="request-pm"[^>]*><img src="assets/dashboard/shortcut-support\.svg"' "$root_dir/index.html"
grep -Fq '{ label: "Request service plan", route: "request-serviceplan"' "$root_dir/app.js"
grep -Fq '{ label: "Request maintenance or support", route: "request-pm"' "$root_dir/app.js"

echo "Dashboard service-plan and maintenance shortcuts open their request flows directly."
