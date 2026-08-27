#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'function aiInstrumentSupportMailto(instruments)' app.js
grep -Fq 'const serialRows = instruments.map((instrument) => `${instrument.serial}\t`).join("\r\n");' app.js
grep -Fq 'Add instrument support request for the following instruments:' app.js
grep -Fq 'mailto:ServicesCentralSupport@thermofisher.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}' app.js
grep -Fq 'data-ai-not-added-help>Get help</a>' app.js
grep -Fq '.ai-summary-card small a' styles.css

echo "Onboarding not-added support email test passed."
