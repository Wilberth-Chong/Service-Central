#!/usr/bin/env bash
set -euo pipefail

# PM Step 3 callouts start at the vertical end of their corresponding H2.
rg -Fq '.pm-details-info { display: flex; align-self: start; margin-top: 36px;' styles.css

echo "PASS: PM details callouts align below their headings"
