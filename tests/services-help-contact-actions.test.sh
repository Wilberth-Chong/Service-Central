#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

grep -Fq 'If you have any trouble using the Services Central platform, feel free to contact us.' index.html
grep -Fq 'href="mailto:ServicesCentralSupport@thermofisher.com" data-services-help-action="general-assistance"' index.html
grep -Fq 'subject=Add%20instrument%20support%20request' index.html
grep -Fq 'Add%20instrument%20support%20request%20for%20the%20following%20instruments' index.html
grep -Fq 'Serial%20number%2A%09Notes%20%28optional%29' index.html
grep -Fq '.services-help-card__actions {' styles.css
grep -Fq 'gap: 8px;' styles.css

echo "Services help contact actions test passed."
