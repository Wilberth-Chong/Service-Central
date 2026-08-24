#!/usr/bin/env bash
set -euo pipefail

# PM promotion and detail-callout icons use an exact platform-blue SVG rather
# than a CSS filter approximation.
blue_icon='assets/icons/notifications/info/size=24px, style=bold-blue.svg'
test -f "$blue_icon"
rg -Fq 'fill="#0071d0"' "$blue_icon"

pm_status=$(sed -n '/<template id="request-pm-status-template">/,/<\/template>/p' index.html)
pm_details=$(sed -n '/<template id="request-pm-details-template">/,/<\/template>/p' index.html)
rg -Fq 'assets/icons/notifications/info/size=24px, style=bold-blue.svg' <<<"$pm_status"
rg -Fq 'assets/icons/notifications/info/size=24px, style=bold-blue.svg' <<<"$pm_details"
rg -Fq 'img[src*="style=bold-blue.svg"] { filter: none; }' styles.css
