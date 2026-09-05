#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_dir"

rg -Fq 'firstName: "My"' app.js
rg -Fq 'lastName: "Name"' app.js
rg -Fq 'fullName: "My Name"' app.js
rg -Fq 'email: "my_name.lastname@company.com"' app.js
rg -Fq 'phone: "123 456789"' app.js
rg -Fq 'const MI_CURRENT_USER_EMAIL = LOGGED_IN_USER.email;' app.js
rg -Fq 'const DEFAULT_INSTALLATION_USER_EMAIL = LOGGED_IN_USER.email;' app.js
rg -Fq 'const contactDefaults = LOGGED_IN_USER_CONTACT;' app.js
rg -Fq 'if (LOGGED_IN_USER_CONTACT[key]) field.value = LOGGED_IN_USER_CONTACT[key];' app.js
rg -Fq 'const ticketContact = ticket.selectedFromHistory ? ticket.contact : LOGGED_IN_USER.fullName;' app.js
rg -Fq 'data-topbar-sc-profile' topbar-sc.js
rg -Fq 'my_name.lastname@company.com' topbar-sc.js
rg -Fq 'topbar-sc__profile-menu' styles.css
test -f assets/header/liu-initials.svg

printf 'PASS: logged-in user identity drives prototype actions, contact defaults, and the header profile menu\n'
