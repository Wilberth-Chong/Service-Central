#!/usr/bin/env bash
set -euo pipefail

rg -q '<h3>Installation</h3>.*data-route="installation-support">Installation support' index.html

printf 'PASS: Installation tile opens installation support\n'
