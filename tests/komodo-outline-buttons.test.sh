#!/usr/bin/env bash
set -euo pipefail

css="styles.css"

rg -Fq -- '--komodo-outline-button-bg: #fff;' "$css"
rg -Fq -- '--komodo-outline-button-border: #92929e;' "$css"
rg -Fq -- '--komodo-outline-button-label: #0071d0;' "$css"
rg -Fq -- '--komodo-outline-button-hover: #005daa;' "$css"
rg -Fq -- '--komodo-outline-button-disabled-bg: #e5e5e5;' "$css"
rg -Fq -- '--komodo-outline-button-disabled-label: #92929e;' "$css"
rg -Fq -- '--komodo-outline-button-focus: #802eff;' "$css"

rg -Fq 'height: 32px !important;' "$css"
rg -Fq 'height: 40px !important;' "$css"
rg -Fq 'height: 48px !important;' "$css"
rg -Fq 'border-radius: 4px !important;' "$css"
rg -Fq 'outline: 1px solid var(--komodo-outline-button-border) !important;' "$css"
rg -Fq 'outline-color: var(--komodo-outline-button-hover) !important;' "$css"
rg -Fq 'box-shadow: inset 0 2px 5px rgb(34 34 34 / 20%) !important;' "$css"
rg -Fq 'outline: 2px solid var(--komodo-outline-button-focus) !important;' "$css"
rg -Fq 'outline-color: var(--komodo-outline-button-disabled-bg) !important;' "$css"
rg -Fq '.mi-button.ins-add-user,' "$css"
rg -Fq ':not(.ins-add-user)' "$css"

for selector in \
  '.komodo-button--outline' \
  '.flow-toolbar button' \
  '.secondary-button' \
  '.virtual-assistant-chat__match-actions button' \
  '.mi-button:not(.mi-button--primary):not(.ai-continue):not(.platform-virtual-assistant):not(.db-titlebar__assistant)' \
  '.mi-pending-actionbar button:not(.mi-pending-actionbar__primary)' \
  '.mi-dialog-button--secondary' \
  '.sd-actions > button:not(.sd-primary):not(.platform-virtual-assistant)' \
  '.id-more-actions' \
  '.service-plan-approval-modal__secondary' \
  '.platform-actionbar .platform-actionbar__button:not(.platform-actionbar__button--primary):not(.platform-actionbar__button--link)' \
  '.ins-view' \
  '.ai-small-button' \
  '.modal__button--secondary' \
  '.preferred-delivery-dates-modal__secondary' \
  '.delivery-checklist-upload-modal__cancel' \
  '.delivery-dates-confirmation-modal__edit' \
  '.delivery-dates-pause-modal__cancel' \
  '.spc-button--secondary'
do
  rg -Fq "$selector" "$css"
done

echo "Komodo outline button checks passed."
