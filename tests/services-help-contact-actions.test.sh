#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'If you have any trouble using the Services Central platform, feel free to contact us.' index.html
grep -Fq 'href="mailto:ServicesCentralSupport@thermofisher.com" data-services-help-action="general-assistance"' index.html
grep -Fq 'data-services-help-action="add-instrument-support" data-ai-instrument-support-email' index.html
grep -Fq 'aiInstrumentSupportMailto([], { includeNickname: false, blankRows: 5 })' app.js
grep -Fq '.services-help-card__actions {' styles.css
grep -Fq 'gap: 8px;' styles.css

echo "Services help contact actions test passed."
