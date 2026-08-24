#!/usr/bin/env bash
set -euo pipefail

# PM Step 4 must inherit the same five-step layout as the existing PM Steps 1–3.
rg -Fq '.screen--request-pm-contact .pm-titlebar { height: 56px; padding: 16px 32px; }' styles.css
rg -Fq '.screen--request-pm-contact .iss-steps--five { width: 1320px; margin: 32px 32px 50px; }' styles.css
rg -Fq '.screen--request-pm-contact .iss-steps--five::before { width: calc(100% - 36px); }' styles.css
rg -Fq '.screen--request-pm-contact .iss-steps--five li:nth-child(4) { justify-items: start; text-align: left; }' styles.css

echo "PASS: PM Step 4 uses the PM five-step viewer layout"
