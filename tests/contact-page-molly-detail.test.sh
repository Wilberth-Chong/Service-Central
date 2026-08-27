#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
page="$repo_dir/index.html"

# Removing Molly's contact-specific identity or the expandable no-plan group is a regression.
grep -Fq 'molly_hartman@companyname.com' "$page"
grep -Fq 'Instruments with Molly Hartman as the service plan contact' "$page"
grep -Fq 'data-contact-group-toggle' "$page"
grep -Fq 'Essential Service Plan - 0040111111' "$page"
grep -Fq 'Instruments with no service plan' "$page"
grep -Fq 'TSQ-Z-12348' "$page"

echo "Molly contact detail includes the referenced coverage groups and instruments."
