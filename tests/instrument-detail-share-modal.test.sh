#!/usr/bin/env bash
set -euo pipefail

js="app.js"
html="index.html"

rg -Fq 'data-id-share-instrument="${target.serial}"' "$js"
rg -Fq 'function openMiShareDialogForInstrument(serial)' "$js"
rg -Fq 'wireMiSelectionDialog(miShareDialog, "share");' "$js"
rg -Fq 'checkbox.checked = row.dataset.miInstrumentSerial === serial;' "$js"
rg -Fq 'openMiShareDialogForInstrument(event.currentTarget.dataset.idShareInstrument);' "$js"
rg -Fq 'data-mi-instrument-serial="${instrument.serial}"' "$js"
rg -Fq 'app.js?v=20260904-komodo-compliance-v4' "$html"

echo "Instrument detail Share modal checks passed."
