#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'Hi ${LOGGED_IN_USER.fullName}, how can I assist you' app.js
if rg -Fq 'Hi John, how can I assist you' app.js; then
  printf 'FAIL: legacy Virtual Assistant greeting remains\n' >&2
  exit 1
fi
printf 'PASS: Virtual Assistant greeting uses the logged-in user name\n'
