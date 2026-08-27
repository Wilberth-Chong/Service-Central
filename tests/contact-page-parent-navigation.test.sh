#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq 'class="contact-parent-navigation" type="button" data-route="service-plan-contacts" data-platform-go-top-anchor' "$repo_dir/index.html"
grep -Fq '<h1>Service plan contact detail</h1>' "$repo_dir/index.html"
sed -n '/^\.contact-parent-navigation {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'font-weight: 700 !important;'
sed -n '/^\.is-platform-titlebar-compact > \.contact-titlebar {/,/^}/p' "$repo_dir/styles.css" | grep -Fq 'height: 88px;'

echo "Contact detail retains parent navigation in normal and compact titlebars."
