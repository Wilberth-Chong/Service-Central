#!/usr/bin/env bash
set -euo pipefail

awk '
  /^\.mi-shell \{/ { in_shell = 1; next }
  in_shell && /^}/ { exit 0 }
  in_shell && /padding-top:/ { exit 1 }
  END { if (!in_shell) exit 1 }
' styles.css
