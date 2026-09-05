#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
app_file="$root_dir/app.js"

grep -Fq '"consumables-support-portal": { title: "Consumables support portal", src: CONSUMABLES_SUPPORT_PORTAL_IMAGE, width: 2446, height: 1610, kind: "external" }' "$app_file"
grep -Fq 'setRoute("consumables-support-portal");' "$app_file"
! grep -Fq 'window.open(CONSUMABLES_SUPPORT_PORTAL_IMAGE' "$app_file"

echo "Consumables support portal opens inside the prototype shell with its navigation toolbar."
