#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules ] || npm ci
export DISABLE_GPU=1
export PORTABLE_MODE=1
npx -y electron .
