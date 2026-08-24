#!/usr/bin/env bash
set -euo pipefail

workflow=".github/workflows/deploy-environments.yml"

rg -Fq 'release:' "$workflow"
rg -Fq 'types:' "$workflow"
rg -Fq 'published' "$workflow"
rg -Fq "git -C prod tag --list 'CR[0-9]*'" "$workflow"
rg -Fq "git -C prod archive \"\${release_tag}\" -- . ':(exclude).github'" "$workflow"
rg -Fq '_site/versions/index.html' "$workflow"
rg -Fq 'Current production' "$workflow"
rg -Fq 'Test environment' "$workflow"

printf 'PASS: Pages deployment publishes immutable version directories\n'
