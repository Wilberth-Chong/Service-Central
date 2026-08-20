#!/usr/bin/env bash
set -euo pipefail

# Removing origin capture or reverting Installation Support exits to a hard-coded route must fail this test.
awk '/function setRoute\(/,/^function addHotspot/' app.js | rg -Fq 'installationSupportReturnRoute = isInstallationsSectionRoute(fromRoute) ? "installations" : "request-support"'
awk '/function renderInstallationSupport\(\)/,/^function renderFlow/' app.js | rg -Fq 'setRoute(installationSupportReturnRoute)'

printf 'PASS: Installation Support returns to its entry route\n'
