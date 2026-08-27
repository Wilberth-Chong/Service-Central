#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'class="pm-search splan-search"' "$repo_dir/index.html"
grep -Fq 'data-splan-search placeholder="Search by instrument serial number or nickname"' "$repo_dir/index.html"
grep -Fq 'data-splan-no-results' "$repo_dir/index.html"
grep -Fq '>No results found</h2>' "$repo_dir/index.html"
grep -Fq 'assets/zero-states/no-results.svg' "$repo_dir/index.html"
grep -Fq '<svg width="94" height="94" viewBox="0 0 94 94"' "$repo_dir/assets/zero-states/no-results.svg"
grep -Fq 'data-route="system-detail-alpine"' "$repo_dir/index.html"
grep -Fq 'data-route="instrument-detail-TSQ-Z-12347"' "$repo_dir/index.html"
grep -Fq 'data-route="instrument-detail-1009996"' "$repo_dir/index.html"

grep -Fq 'function filterServicePlanContacts(query)' "$repo_dir/app.js"
grep -Fq 'search.addEventListener("input"' "$repo_dir/app.js"
grep -Fq 'row.dataset.splanSearch' "$repo_dir/app.js"
grep -Fq 'function setServicePlanGroupExpanded(group, expanded)' "$repo_dir/app.js"
grep -Fq 'group.hidden = matchCount === 0' "$repo_dir/app.js"
grep -Fq 'setServicePlanGroupExpanded(group, true)' "$repo_dir/app.js"
grep -Fq 'noResults.hidden = totalMatches !== 0' "$repo_dir/app.js"
grep -Fq 'group.dataset.splanDefaultExpanded === "true"' "$repo_dir/app.js"

grep -Fq '.splan-search { width: 642px; margin-bottom: 32px; }' "$repo_dir/styles.css"
grep -Fq '.splan-no-results[hidden] { display: none; }' "$repo_dir/styles.css"
grep -Fq '.splan-no-results > img { width: 89px; height: 89px; margin-bottom: 20px; }' "$repo_dir/styles.css"

echo "Service plan contact tables expose detail routes and shared search behavior."
