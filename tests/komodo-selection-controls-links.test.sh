#!/usr/bin/env bash
set -euo pipefail

stylesheet="styles.css"
entrypoint="index.html"

grep -Fq -- '--komodo-link: #0071d0;' "$stylesheet"
grep -Fq -- '--komodo-link-hover: #005daa;' "$stylesheet"
grep -Fq -- '--komodo-control-border: #92929e;' "$stylesheet"
grep -Fq -- ':root body :is(input[type="checkbox"], input[type="radio"]) {' "$stylesheet"
grep -Fq -- 'width: 20px;' "$stylesheet"
grep -Fq -- 'height: 20px;' "$stylesheet"
grep -Fq -- 'input[type="checkbox"]:indeterminate' "$stylesheet"
grep -Fq -- 'input[type="checkbox"]:checked:disabled' "$stylesheet"
grep -Fq -- 'input[type="radio"]:checked:disabled' "$stylesheet"
grep -Fq -- 'radial-gradient(circle at center, var(--komodo-link) 0 6px' "$stylesheet"
grep -Fq -- 'outline: 2px solid var(--komodo-link);' "$stylesheet"
grep -Fq -- 'min-height: 32px;' "$stylesheet"
grep -Fq -- 'column-gap: 12px;' "$stylesheet"
grep -Fq -- 'a:not([aria-disabled="true"]):hover' "$stylesheet"
grep -Fq -- 'styles.css?v=20260904-komodo-compliance-v13' "$entrypoint"

echo "Komodo selection control and link compliance checks passed."
