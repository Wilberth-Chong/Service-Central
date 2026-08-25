#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rg -q '\.ins-summary-box \{ width: 214px; height: 88px;' styles.css
rg -q 'grid-template-rows: 22px 22px; column-gap: 4px; row-gap: 6px; align-content: start' styles.css
rg -q 'font-size: 14px; font-weight: 500; line-height: 22px' styles.css
rg -q 'font-size: 14px; font-weight: 400; line-height: 22px' styles.css
rg -q '\.ins-summary-box--support \{ display: grid; grid-template-columns: 16px minmax\(0, 1fr\) 42px; grid-template-rows: 22px 24px; column-gap: 4px; row-gap: 6px; align-content: start' styles.css
rg -q '\.wg-order-summary \.ins-summary-box--users \{ width: 325px; \}' styles.css
rg -q '\.wg-order-summary \.ins-summary-box--support \{ width: 325px; \}' styles.css

echo "Installation summary card fidelity checks passed."
