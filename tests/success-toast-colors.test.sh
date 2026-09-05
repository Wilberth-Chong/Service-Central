#!/usr/bin/env bash
set -euo pipefail

css="styles.css"
js="app.js"

rg -Fq '.toast.toast--success {' "$css"
rg -Fq -- '--toast-accent: #00a824;' "$css"
rg -Fq -- '--toast-accent: #00a824 !important;' "$css"
rg -Fq '.toast__icon[hidden] {' "$css"
rg -Fq 'const isSuccess = variant === "success" || variant === "checklist" || isPreInstallChecklist || variant === "system-success";' "$js"
rg -Fq 'toast.classList.toggle("toast--success", isSuccess);' "$js"
rg -Fq 'toast.querySelector("[data-toast-icon]").hidden = !isSuccess;' "$js"
rg -Fq 'showToast("Instrument access shared", { variant: "success" });' "$js"
rg -Fq 'showToast("Group created", { variant: "success" });' "$js"
test "$(rg -Fc 'showToast("Column preferences updated", { variant: "success" });' "$js")" -eq 2

echo "Success toast color checks passed."
