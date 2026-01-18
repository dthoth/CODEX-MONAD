# CODEX-VAULT v2.0.0

**Portable Symmetric Secret Store with Multi-Envelope Master Key Architecture**

Part of the CODEX-MONAD Consciousness Infrastructure

## What Changed from v1

v1 had three fatal flaws:
1. **Non-deterministic YubiKey challenge** - Random challenge each unlock = different response = can't decrypt
2. **No master key** - Each entry encrypted directly with passphrase = can't support multiple unlock paths
3. **Hybrid impossible** - "Same contribution via different paths" is cryptographically nonsensical

v2 fixes all of this with a proper KeePass-class architecture.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MASTER KEY (MK)                             │
│                    32 bytes, random, never stored                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ encrypts all entries
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           VAULT DATA                                │
│                 entries/*.gpg encrypted with MK                     │
└─────────────────────────────────────────────────────────────────────┘

                    MK is wrapped multiple ways:

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  master.key.pass │  │  master.key.yk   │  │  master.key.kf   │
│                  │  │                  │  │                  │
│  wrapped with:   │  │  wrapped with:   │  │  wrapped with:   │
│  passphrase +    │  │  passphrase +    │  │  passphrase +    │
│  witness_hash    │  │  yubikey_factor  │  │  keyfile_factor  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

Any ONE envelope can unwrap MK → multiple backup paths
```

## Key Improvements

### 1. Stable 64-byte Challenge (SHA-512)
```bash
CHALLENGE = SHA512("codex-vault-v3:" || VAULT_ID)
```
No more "short challenge" mode ambiguity. The challenge is deterministic for each vault.

### 2. Tagged Physical Factors
`get_physical_factor` now returns tagged output:
- `yk:a1b2c3...` → use `master.key.yk` envelope
- `kf:d4e5f6...` → use `master.key.kf` envelope
- `none:` → use `master.key.pass` envelope

This lets the unlock flow pick the correct envelope deterministically.

### 3. Proper Directory Structure
```
.codex-vault/
├── .vault-id              # UUID, stable challenge source
├── .vault-config          # Settings
├── .keyring/
│   ├── config             # key_type, fingerprints
│   ├── .mk-check          # MK verification file
│   ├── master.key.pass    # MK wrapped with passphrase+witness
│   ├── master.key.yk      # MK wrapped with passphrase+yk_factor
│   └── master.key.kf      # MK wrapped with passphrase+kf_hash
└── entries/
    ├── api/
    │   └── anthropic.gpg
    └── passwords/
        └── github.gpg
```

### 4. YubiKey Tool Flexibility
Supports both `ykman` and `ykchalresp`:
```bash
# ykman (preferred)
ykman otp calculate 2 "$challenge"

# ykchalresp (fallback)
ykchalresp -2 -x "$challenge"
```

### 5. Local Keyfile Protection
Local keyfiles (in vault directory) require explicit opt-in via `allow_local_keyfile=true`. This prevents "require_physical=true" from being silently defeated.

## Quick Start

```bash
# Initialize vault
./vault-v2 init

# Follow the ceremony:
#   1. Set passphrase
#   2. Configure physical key (YubiKey/Keyfile/Both/None)
#   3. Set witness phrase (for software-only unlock)
#   4. Set emergency anchor (optional)

# Add secrets
./vault-v2 insert api/anthropic
./vault-v2 generate passwords/github

# Use vault
./vault-v2 unlock            # Cache MK in session
./vault-v2 show api/anthropic
./vault-v2 clip passwords/github

# Key management
./vault-v2 keyring status     # Physical key status
./vault-v2 envelope status    # Which envelopes exist
./vault-v2 envelope add yk    # Add YubiKey envelope
./vault-v2 envelope revoke kf # Remove keyfile envelope
```

## Files

| File | Purpose |
|------|---------|
| `vault-v2` | Main CLI script |
| `vault-keyring-v3.sh` | Physical key operations (YubiKey/Keyfile) |
| `vault-envelopes.sh` | Master key wrapping/unwrapping |
| `ARCHITECTURE-v2.md` | Design documentation |

## Security Model

1. **Master Key (MK)** - 32 random bytes, never stored plaintext
2. **Key Encryption Key (KEK)** - Derived from passphrase + factor(s)
3. **Envelopes** - MK wrapped with different KEKs

An attacker needs:
- Your passphrase, AND
- Your physical factor (YubiKey/keyfile), OR
- Your witness phrase (if software-only envelope exists)

## Adding a New Key

```bash
# 1. Unlock vault (any working method)
./vault-v2 unlock

# 2. Add new envelope
./vault-v2 envelope add yk  # Or: envelope add kf

# Now BOTH can unlock the same vault
```

## Revoking a Key

```bash
# Remove an envelope
./vault-v2 envelope revoke kf

# That key can no longer unlock (MK itself unchanged)
```

## Dependencies

- `bash` 4+
- `gpg` (gnupg)
- `ykman` or `ykchalresp` (for YubiKey support)
- Standard UNIX tools: `head`, `xxd`/`od`, `sha256sum`/`shasum`

## Future: Phase 2

Replace GPG with:
- Argon2id for KDF
- XChaCha20-Poly1305 for encryption  
- Proper memory zeroization
- Native YubiKey bindings

The architecture remains the same.

---

*"The vault is sealed not by complexity, but by the elegant convergence of factors."*
