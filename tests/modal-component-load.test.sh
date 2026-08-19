#!/usr/bin/env bash
set -euo pipefail

rg -q '<script src="modal\.js\?v=[^"]+"></script>' index.html
rg -q '<script src="app\.js\?v=[^"]+"></script>' index.html
rg -q 'data-modal-mount="installation-pending"' index.html
rg -q 'window\.Modal = api;' modal.js

modal_line=$(rg -n '<script src="modal\.js' index.html | cut -d: -f1)
app_line=$(rg -n '<script src="app\.js' index.html | cut -d: -f1)

test "$modal_line" -lt "$app_line"
