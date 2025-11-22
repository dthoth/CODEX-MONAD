#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo 'Node.js not found. Install Node 18+ from https://nodejs.org'; exit 1; }
[ -d node_modules ] || npm ci
npm run start
