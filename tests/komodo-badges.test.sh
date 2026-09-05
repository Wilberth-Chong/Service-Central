#!/usr/bin/env bash
set -euo pipefail

stylesheet="styles.css"

grep -Fq -- '--komodo-badge-blue-bg: #dfeeff;' "$stylesheet"
grep -Fq -- '--komodo-badge-gray-bg: #e5e5e5;' "$stylesheet"
grep -Fq -- '--komodo-badge-green-bg: #d9fbe2;' "$stylesheet"
grep -Fq -- '--komodo-badge-orange-bg: #ffddc2;' "$stylesheet"
grep -Fq -- '--komodo-badge-red-bg: #fde4e4;' "$stylesheet"
grep -Fq -- '--komodo-count-red: #e71316;' "$stylesheet"
grep -Fq -- '.mi-status,' "$stylesheet"
grep -Fq -- '.mi-new-badge, .mi-user-role, .sd-role' "$stylesheet"
grep -Fq -- '.topbar-sc__badge,' "$stylesheet"
grep -Fq -- 'height: 24px;' "$stylesheet"
grep -Fq -- 'height: 20px;' "$stylesheet"
grep -Fq -- 'padding: 2px 6px;' "$stylesheet"
grep -Fq -- 'border-radius: 12px;' "$stylesheet"

echo "Komodo badge compliance checks passed."
