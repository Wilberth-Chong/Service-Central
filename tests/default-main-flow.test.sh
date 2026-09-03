#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'function ensurePrototypeFlowContext()' app.js
grep -Fq 'params.set("prototype-experience", "main");' app.js
grep -Fq 'if (!nextUrl.hash) nextUrl.hash = "#signin";' app.js
grep -Fq 'ensurePrototypeFlowContext();' app.js

echo "Default Main flow test passed."
