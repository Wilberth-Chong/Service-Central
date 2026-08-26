#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
template=$(awk '
  /<template id="installation-shell-detail-template">/ { capture = 1 }
  capture { print }
  capture && /<\/template>/ { exit }
' "$repo_dir/index.html")

printf '%s\n' "$template" | grep -Fq 'class="shell-detail-hero" data-platform-titlebar'
printf '%s\n' "$template" | grep -Fq 'class="shell-detail-back" type="button" data-shell-back data-platform-go-top-anchor'
printf '%s\n' "$template" | grep -Fq '<div data-footer-mount></div>'
if printf '%s\n' "$template" | grep -Fq '<footer class="mi-footer">'; then
  echo "Instrument shell detail still contains a duplicated legacy footer." >&2
  exit 1
fi

render_function=$(awk '
  /^function renderInstallationShellDetail\(route\) \{/ { capture = 1 }
  capture { print }
  capture && /^}/ { exit }
' "$repo_dir/app.js")

printf '%s\n' "$render_function" | grep -Fq 'mountFooter();'

compact_back_rule=$(awk '
  /^\.is-platform-titlebar-compact > \.shell-detail-hero \.shell-detail-back \+ \.platform-titlebar__go-top \{/ { capture = 1 }
  capture { print }
  capture && /^}/ { exit }
' "$repo_dir/styles.css")
printf '%s\n' "$compact_back_rule" | grep -Fq 'margin-left: 16px;'

compact_shell_rule=$(awk '
  /^\.is-platform-titlebar-compact > \.shell-detail-hero \{/ { capture = 1 }
  capture { print }
  capture && /^}/ { exit }
' "$repo_dir/styles.css")
printf '%s\n' "$compact_shell_rule" | grep -Fq 'flex-direction: row;'
printf '%s\n' "$compact_shell_rule" | grep -Fq 'gap: 0;'

echo "PASS: instrument shell detail uses the shared titlebar and footer components"
