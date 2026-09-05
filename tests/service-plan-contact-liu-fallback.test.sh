#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

grep -Fq '"plan-0040333333": []' "$root_dir/app.js"
grep -Fq 'const loggedInUserEmail = LOGGED_IN_USER.email;' "$root_dir/app.js"
grep -Fq 'return combinations.length ? combinations : [[loggedInUserEmail]];' "$root_dir/app.js"
grep -Fq 'return rowEmails.length ? [rowEmails] : [[loggedInUserEmail]];' "$root_dir/app.js"
grep -Fq 'const defaults = includesLoggedInUser ? [loggedInUserEmail]' "$root_dir/app.js"

echo "Service plan contact LIU fallback checks passed."
