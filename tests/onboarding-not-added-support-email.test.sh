#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'function aiInstrumentSupportMailto(instruments, options = {})' app.js
grep -Fq 'function aiInstrumentSupportTextTable(instruments, { includeNickname = true, blankRows = 0 } = {})' app.js
grep -Fq '{ label: "Serial number"' app.js
grep -Fq '{ label: "Nickname"' app.js
grep -Fq '{ label: "Notes"' app.js
grep -Fq 'notes: instrument.notes || aiSummaryNotAddedNote(instrument)' app.js
grep -Fq 'const widths = columns.map((column, index) => Math.max(column.label.length' app.js
grep -Fq 'value.padEnd(widths[index])' app.js
if grep -Fq 'const border = `+${widths.map' app.js; then
  echo "Instrument support email should not contain cell borders." >&2
  exit 1
fi
grep -Fq 'Add instrument support request for the following instruments:' app.js
grep -Fq 'mailto:ServicesCentralSupport@thermofisher.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}' app.js
grep -Fq 'data-ai-not-added-help>Get help</a>' app.js
grep -Fq '.ai-summary-card small a' styles.css

echo "Onboarding not-added support email test passed."
