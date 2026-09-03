#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_JS="$ROOT_DIR/app.js"
INDEX_HTML="$ROOT_DIR/index.html"
STYLES="$ROOT_DIR/styles.css"

rg -Fq 'installation-status-scenarios-dialog virtual-assistant-route-dialog flows-dialog' "$INDEX_HTML"
rg -Fq '<p class="virtual-assistant-route-dialog__eyebrow">Prototype routing</p>' "$INDEX_HTML"
rg -Fq '<h2 id="installation-status-scenarios-title">Status change</h2>' "$INDEX_HTML"
rg -Fq 'Select an installation status scenario to simulate offline installation events.' "$INDEX_HTML"
rg -Fq 'installation-status-scenarios-modal__options flows-grid' "$INDEX_HTML"
test "$(rg -o 'class="flow-link" type="button" data-installation-status-scenario=' "$INDEX_HTML" | wc -l | tr -d ' ')" = "4"

! rg -Fq 'if (installationStatusTargetOrder === "9012611245" && !areInstallationStepsComplete()) return;' "$APP_JS"
rg -Fq 'button.disabled = false;' "$APP_JS"
rg -Fq 'allStepsComplete || installationStatusScenario !== "in-progress"' "$APP_JS"
rg -Fq 'submittedProgressPreInstallChecklists.push({ ...checklist, submittedBy: DEFAULT_INSTALLATION_USER_EMAIL });' "$APP_JS"
rg -Fq 'noChecklistOrderState.step3Complete = scenario !== "in-progress";' "$APP_JS"
rg -Fq 'preferredDeliveryDatesSubmitted = true;' "$APP_JS"
rg -Fq 'deliveryChecklistSubmitted = true;' "$APP_JS"
rg -Fq 'setPreInstallChecklistComplete(true);' "$APP_JS"
rg -Fq 'state.scenarioSelected = true;' "$APP_JS"
rg -Fq 'data-wg-order-status hidden' "$APP_JS"
rg -Fq '.ins-items th button:not(:disabled):hover { border-color: #6058df; color: #6058df; background: #f1f0ff; }' "$STYLES"
rg -Fq '.virtual-assistant-route-dialog > .virtual-assistant-route-dialog__eyebrow' "$STYLES"
rg -Fq '.virtual-assistant-route-dialog .installation-status-scenarios-modal__options .flow-link' "$STYLES"
rg -Fq '.installation-status-scenarios-modal__options strong { color: inherit; font-size: 14px; font-weight: 700; line-height: 20px; }' "$STYLES"
rg -Fq '.installation-status-scenarios-modal__options span { color: #54545c; font-size: 14px; font-weight: 400; line-height: 20px; }' "$STYLES"

echo "Installation status prototype modal checks passed."
