#!/usr/bin/env bash
set -euo pipefail

multi_select_line=$(rg -n '<script src="multi-select-filter\.js' index.html | cut -d: -f1)
date_range_line=$(rg -n '<script src="date-range-picker\.js' index.html | cut -d: -f1)
app_line=$(rg -n '<script src="app\.js' index.html | cut -d: -f1)

test -n "$multi_select_line"
test -n "$date_range_line"
test "$multi_select_line" -lt "$app_line"
test "$date_range_line" -lt "$app_line"
