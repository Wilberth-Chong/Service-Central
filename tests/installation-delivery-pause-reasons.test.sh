#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

for reason in \
  "Lab is under construction" \
  "Lab not ready due to an unforeseen event (e.g., damage from an accident, etc.)" \
  "No space available to receive the instrument" \
  "Lab construction delayed pending budget approval" \
  "Other"
do
  grep -Fq "value=\"$reason\"" "$repo_dir/index.html"
  grep -Fq "<span>$reason</span>" "$repo_dir/index.html"
done

grep -F '.delivery-dates-pause-modal__reasons input {' "$repo_dir/styles.css" | grep -Fq 'width: 24px; height: 24px;'
grep -Fq 'Note: If you pause, reminders will be suspended until the pause period ends. You still have the option to submit dates during this period.' "$repo_dir/index.html"
grep -F '.delivery-dates-pause-modal__pause {' "$repo_dir/styles.css" | grep -Fq 'gap: 8px;'
grep -F '.delivery-dates-pause-modal__pause > p {' "$repo_dir/styles.css" | grep -Fq 'font-size: 13px; font-weight: 500; line-height: 18px;'
grep -Fq 'data-delivery-pause-other-details hidden' "$repo_dir/index.html"
grep -F '.delivery-dates-pause-modal__other-details {' "$repo_dir/styles.css" | grep -Fq 'margin-top: 24px;'
grep -Fq 'otherDetails.hidden = !isOther;' "$repo_dir/app.js"
grep -Fq 'const hasDetails = !isOther ||' "$repo_dir/app.js"
grep -Fq 'cannotProvideDatesButton.hidden = Boolean(days)' "$repo_dir/app.js"
grep -Fq 'Email reminder paused for ${days} days' "$repo_dir/app.js"
grep -Fq 'assets/icons/notifications/warning/size=16px, style=bold.svg' "$repo_dir/app.js"
grep -F '.ins-action-card > .ins-action-card__pause-status {' "$repo_dir/styles.css" | grep -Fq 'height: 24px;'
grep -F '.ins-action-card > .ins-action-card__pause-status {' "$repo_dir/styles.css" | grep -Fq 'gap: 4px;'
grep -F '.ins-action-card > .ins-action-card__pause-status {' "$repo_dir/styles.css" | grep -Fq 'padding: 1px 10px;'
grep -F '.ins-action-card > .ins-action-card__pause-status {' "$repo_dir/styles.css" | grep -Fq 'background: #ffebd6;'
grep -Fq '.preferred-delivery-dates-modal__footer button[hidden] { display: none; }' "$repo_dir/styles.css"
if grep -Fq 'data-delivery-pause-default-details' "$repo_dir/index.html"; then
  echo "Default reasons must not render an Additional details field." >&2
  exit 1
fi

echo "Installation delivery pause reasons test passed."
