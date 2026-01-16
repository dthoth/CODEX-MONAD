# Test Checklist (RC-portable-OK)

## Environments
- Windows 11 Pro
- macOS 14–15
- Ubuntu 22.04

## Steps
1. `npm ci`
2. `npm run doctor`
3. `npm run start`  (or `npm run start:nogpu` if needed)
4. Click **Apps** → open: DIN Portal, Pranayama, Codex Monad, Bureaucratic Universe
5. Quit → relaunch. Confirm `./data/` and `./data/logs/` updated
6. Disable network → launch and open each app (should work offline)
7. Change display scale to 150% and 200% → UI remains usable
8. Run under standard (non-admin) account
9. Move folder to deep path with spaces and unicode → launch
10. Collect logs if any issue: `./data/logs/app-YYYY-MM-DD.log`

## Pass/Fail
- All state confined to `./data/`
- No console errors on app open
- No crash over 30 minutes idle
- `window.require` is unavailable in app windows
- `window.open()` is denied
