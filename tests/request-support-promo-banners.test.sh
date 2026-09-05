#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'class="rs-promo-banner"' "$root_dir/index.html"
test "$(grep -o 'class="rs-promo-banner"' "$root_dir/index.html" | wc -l | tr -d ' ')" = "3"
grep -Fq 'Get up to 20% off<br />Preventive Maintenance for your HPLC' "$root_dir/index.html"
test "$(grep -o 'Banner title <strong>lorem 10%</strong> ipsum dolor amet, consectetur adipiscing elit. Vestibulum sodal' "$root_dir/index.html" | wc -l | tr -d ' ')" = "2"

grep -Fq 'width: 420px;' "$root_dir/styles.css"
grep -Fq 'height: 337px;' "$root_dir/styles.css"
grep -Fq '.rs-promo-banner:first-child { height: 226px; }' "$root_dir/styles.css"
grep -Fq 'padding: 32px;' "$root_dir/styles.css"
grep -Fq 'background: #f1f9ff;' "$root_dir/styles.css"
grep -Fq 'font-size: 30px;' "$root_dir/styles.css"
grep -Fq 'font-weight: 300;' "$root_dir/styles.css"
grep -Fq 'line-height: 40px;' "$root_dir/styles.css"

echo "Request Support promo banner checks passed."
