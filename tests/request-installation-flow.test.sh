#!/usr/bin/env bash
set -euo pipefail

rg -q 'id="request-installation-native-template"' index.html
rg -q 'route === "request-installation"' app.js
rg -q 'data-route="request-installation"' index.html
rg -q 'data-installation-service' index.html
rg -Fq 'Select order(s) <b' index.html
rg -q 'Installation topic <b' index.html
rg -q 'data-installation-details required' index.html
rg -q 'Get help from the installation team.' index.html
rg -q 'data-installation-order-toggle' index.html
rg -Fq '.installation-card form { width: 560px; }' styles.css
rg -q '\.installation-order-select \{[^}]*width: 296px;' styles.css
rg -Fq '.installation-card textarea { width: 100%; height: 96px; resize: vertical; border: 1px solid #ccc; padding: 10px 14px; color: #333; font-family: inherit; font-size: 14px; line-height: 20px; }' styles.css
