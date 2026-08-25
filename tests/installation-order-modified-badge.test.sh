#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

grep -Fq '<span class="ins-badge ins-badge--modified" data-progress-order-modified><img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" />Order modified</span>' "$ROOT_DIR/app.js"
grep -Fq 'order.querySelector("[data-progress-order-modified]").hidden = installationComplete;' "$ROOT_DIR/app.js"
grep -Fq '.ins-badge--modified { color: #00399c; background: #dfeeff; }' "$ROOT_DIR/styles.css"

echo "Installation order-modified badge checks passed."
