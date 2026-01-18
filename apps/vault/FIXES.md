# CODEX-VAULT v2: GPT Feedback Implementation

## Summary of Changes

GPT's critique identified 5 issues and a next milestone. All have been addressed.

---

## Fix #1: `.keyring` Path Collision

**Problem:** `.keyring` was a file, but v2 layout needs a directory containing config + envelopes.

**Before:**
```bash
KEYRING_CONFIG="$VAULT_DIR/.keyring"  # File
```

**After:**
```bash
KEYRING_DIR="$VAULT_DIR/.keyring"     # Directory
KEYRING_CONFIG="$KEYRING_DIR/config"  # File inside directory
```

**Location:** `vault-keyring-v3.sh` lines 20-22

---

## Fix #2: YubiKey Tool Consistency

**Problem:** `configure_yubikey()` used `ykman`, but `yubikey_challenge()` only worked with `ykchalresp`.

**After:**
```bash
yubikey_challenge() {
    local challenge="$1"
    
    if command -v ykman &>/dev/null; then
        # ykman otp calculate expects hex challenge
        ykman otp calculate 2 "$challenge" 2>/dev/null | tr -d ' \r\n'
    elif command -v ykchalresp &>/dev/null; then
        # ykchalresp -2 = slot 2, -x = hex input
        ykchalresp -2 -x "$challenge" 2>/dev/null | tr -d ' \r\n'
    else
        return 1
    fi
}
```

**Location:** `vault-keyring-v3.sh` lines 82-97

---

## Fix #3: 64-byte Challenge (SHA-512)

**Problem:** 32-byte challenge (SHA-256) could hit "short challenge" mode ambiguity.

**After:**
```bash
# Use SHA-512 for 64-byte challenges
sha512() {
    if command -v sha512sum &>/dev/null; then
        sha512sum | cut -d' ' -f1
    elif command -v shasum &>/dev/null; then
        shasum -a 512 | cut -d' ' -f1
    else
        openssl dgst -sha512 | sed 's/.*= //'
    fi
}

get_binding_challenge() {
    local vault_id
    vault_id=$(get_vault_id)
    # SHA-512 gives us 64 bytes = 128 hex chars
    printf 'codex-vault-v3:%s' "$vault_id" | sha512
}
```

**Location:** `vault-keyring-v3.sh` lines 45-63

---

## Fix #4: Tagged Physical Factor Output

**Problem:** Hybrid mode returned one factor but caller couldn't know which envelope to use.

**After:**
```bash
get_physical_factor() {
    # Returns: "yk:<factor>" or "kf:<factor>" or "none:"
    
    case "$key_type" in
        yubikey)
            printf 'yk:%s' "$factor"
            ;;
        keyfile)
            printf 'kf:%s' "$factor"
            ;;
        hybrid)
            # Try YubiKey first, then keyfile
            if [[ -n "$yk_factor" && matches_fingerprint ]]; then
                printf 'yk:%s' "$yk_factor"
                return 0
            fi
            if [[ -n "$kf" && matches_fingerprint ]]; then
                printf 'kf:%s' "$kf_factor"
                return 0
            fi
            ;;
    esac
}

# Helpers to parse tagged output
get_factor_type() { printf '%s' "${1%%:*}"; }
get_factor_value() { printf '%s' "${1#*:}"; }
```

**Location:** `vault-keyring-v3.sh` lines 154-212

---

## Fix #5: Local Keyfile Protection

**Problem:** Local keyfile in `$VAULT_DIR/.codex-key` silently defeated `require_physical=true`.

**After:**
```bash
detect_keyfile_removable() {
    # Only search removable media paths
    local patterns=(
        "/media/$USER/*/.codex-key"
        "/mnt/*/.codex-key"
        "/Volumes/*/.codex-key"
    )
    # ...
}

detect_keyfile_local() {
    [[ -f "$VAULT_DIR/.codex-key" ]] && printf '%s' "$VAULT_DIR/.codex-key"
}

detect_keyfile() {
    local allow_local="${ALLOW_LOCAL_KEYFILE:-false}"
    
    # Always prefer removable media
    removable=$(detect_keyfile_removable)
    [[ -n "$removable" ]] && printf '%s' "$removable" && return 0
    
    # Only check local if explicitly allowed
    if [[ "$allow_local" == "true" ]]; then
        # ...
    fi
    
    return 1
}
```

**Location:** `vault-keyring-v3.sh` lines 107-137

---

## Milestone: Envelope System

**GPT said:** "Your next real milestone isn't more keyring polish — it's implementing the envelope files."

**Implemented:** `vault-envelopes.sh` with:

- `generate_master_key()` - Creates 32 random bytes
- `wrap_master_key(mk, kek, path)` - Creates envelope
- `unwrap_master_key(kek, path)` - Opens envelope
- `create_mk_check(mk)` - Verification file
- `verify_master_key(mk)` - Validates MK was unwrapped correctly
- `attempt_unlock(pass, witness, anchor)` - Tries envelopes in priority order
- `init_envelopes(pass, witness, anchor)` - Genesis ceremony
- `add_envelope(type, pass)` - Add new unlock method
- `revoke_envelope(type)` - Remove unlock method

**Envelope files:**
- `master.key.pass` - passphrase + witness
- `master.key.yk` - passphrase + yubikey_factor
- `master.key.kf` - passphrase + keyfile_factor
- `master.key.em` - emergency (all factors)

---

## Integration

The main `vault-v2` script sources both modules and:

1. Caches MK in session (not passphrase)
2. Uses `get_physical_factor()` to get tagged factor
3. Uses `attempt_unlock()` to try envelopes in priority
4. All entries encrypted with MK via GPG symmetric

---

## Testing Checklist

- [ ] Initialize new vault with YubiKey
- [ ] Initialize new vault with keyfile on USB
- [ ] Initialize new vault with hybrid (both)
- [ ] Initialize new vault passphrase-only
- [ ] Unlock with YubiKey present → uses `master.key.yk`
- [ ] Unlock with keyfile present → uses `master.key.kf`
- [ ] Unlock with neither (witness) → uses `master.key.pass`
- [ ] Add YubiKey to existing vault
- [ ] Add keyfile to existing vault
- [ ] Revoke envelope (verify can't revoke last one)
- [ ] Portable mode works

---

*"The vault is now KeePass-class. The rest is ergonomics."*
