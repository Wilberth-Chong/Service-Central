#!/usr/bin/env bash
set -euo pipefail

css="styles.css"

rg -Fq -- '--komodo-primary-button-bg: #e71316;' "$css"
rg -Fq -- '--komodo-primary-button-bg-hover: #c40003;' "$css"
rg -Fq -- '--komodo-primary-button-disabled-bg: #e5e5e5;' "$css"
rg -Fq -- '--komodo-primary-button-disabled-label: #92929e;' "$css"
rg -Fq -- '--komodo-primary-button-focus: #802eff;' "$css"

rg -Fq 'height: 40px !important;' "$css"
rg -Fq 'border-radius: 4px !important;' "$css"
rg -Fq 'padding: 0 24px !important;' "$css"
rg -Fq 'font-size: 14px !important;' "$css"
rg -Fq 'font-weight: 700 !important;' "$css"
rg -Fq 'line-height: 22px !important;' "$css"
rg -Fq 'box-shadow: inset 0 4px 4px rgb(0 0 0 / 25%) !important;' "$css"
rg -Fq 'outline: 2px solid var(--komodo-primary-button-focus) !important;' "$css"
rg -Fq 'outline: 1px solid var(--komodo-primary-button-disabled-bg) !important;' "$css"

for selector in \
  '.signin-form button' \
  '.virtual-assistant-chat__select' \
  '.mi-button--primary' \
  '.mi-pending-actionbar__primary' \
  '.mi-suggestion-ignore-dialog__primary' \
  '.mi-dialog-button--primary' \
  '.sd-primary' \
  '.sd-confirm-submit' \
  '.id-primary' \
  '.service-plan-approval-modal__primary' \
  '.platform-actionbar__button--primary' \
  '.platform-actionbar-cancel-modal__confirm' \
  '.ai-continue' \
  '.modal__button--primary' \
  '.add-user-order-modal__confirm' \
  '.preferred-delivery-dates-modal__primary' \
  '.delivery-checklist-upload-modal__submit' \
  '.delivery-checklist-confirmation-modal__confirm' \
  '.delivery-dates-confirmation-modal__confirm' \
  '.delivery-dates-pause-modal__confirm' \
  '.spc-button--primary'
do
  rg -Fq "$selector" "$css"
done

echo "Komodo primary button checks passed."
