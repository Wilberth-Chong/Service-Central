#!/usr/bin/env bash
set -euo pipefail

js="app.js"
html="index.html"

for selector in \
  'data-ai-banner-art' \
  'data-ai-banner-title' \
  'data-ai-banner-body' \
  'data-ai-banner-action'
do
  rg -Fq "$selector" "$html"
done

test "$(rg -o '<span></span>' "$html" | wc -l | tr -d ' ')" -ge 3
rg -Fq 'Suggestion 1 of 4' "$html"
rg -Fq 'function openInstrumentBannerDestination(banner)' "$js"
rg -Fq 'nextUrl.searchParams.set("instruments-tab", banner.tab);' "$js"
rg -Fq 'nextUrl.searchParams.set("instruments-section", banner.section);' "$js"
rg -Fq 'section: "support"' "$js"
rg -Fq 'section: "related"' "$js"
rg -Fq 'section: "awaiting"' "$js"
rg -Fq 'section: "shared"' "$js"
rg -Fq 'openInstrumentBannerDestination(DASHBOARD_BANNERS[bannerIndex])' "$js"
rg -Fq 'app.js?v=20260904-komodo-compliance-v5' "$html"

echo "Add Instruments banner carousel checks passed."
