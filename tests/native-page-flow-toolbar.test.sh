#!/usr/bin/env bash
set -euo pipefail

rg -q '^function mountNativePageChrome\(activeRoute, \{ title, backRoute = "request-support" \} = \{\}\) \{' app.js
rg -q 'toolbar\.className = "flow-toolbar";' app.js
rg -q 'stage\.before\(toolbar\);' app.js
rg -q 'shell\.classList\.add\("mi-shell--native-flow"\);' app.js
rg -q 'mountNativePageChrome\("request-support", \{ title: "Open a support ticket", backRoute: "request-support" \}\);' app.js
rg -q 'mountNativePageChrome\("support-history", \{ title: ticket\.title, backRoute: "support-history" \}\);' app.js
rg -q '\.mi-shell--native-flow > \.topbar-sc \{' styles.css
rg -q 'top: var\(--platform-flow-toolbar-height\);' styles.css
rg -q '\.mi-shell--native-flow > \.platform-sidebar \{' styles.css
rg -q 'top: calc\(var\(--platform-flow-toolbar-height\) \+ var\(--platform-topbar-height\)\);' styles.css
rg -q 'styles\.css\?v=20260819-native-flow-scroll-container' index.html

printf 'PASS: native flow pages mount the standard toolbar and fixed header\n'
