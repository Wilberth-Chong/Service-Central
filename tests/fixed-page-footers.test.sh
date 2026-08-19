#!/usr/bin/env bash
set -euo pipefail

# Native page footer variants must stay fixed while the page content scrolls.
footer_rule_has_fixed_position() {
  awk -v selector="$1" '
    $0 == selector " {" { in_rule = 1; next }
    in_rule && /^}/ { exit }
    in_rule && /position: fixed;/ { found = 1 }
    END { exit !found }
  ' styles.css
}

footer_rule_has_fixed_position '.mi-footer'
footer_rule_has_fixed_position '.ns-footer'
footer_rule_has_fixed_position '.spc-footer'

awk '
  /^\.mi-footer \{/ { in_rule = 1; next }
  in_rule && /^}/ { exit }
  in_rule && /z-index: 20;/ { found = 1 }
  END { exit !found }
' styles.css
