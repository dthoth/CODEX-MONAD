# CODEX-VAULT v2 Architecture

## The Problem with v1

1. **Non-deterministic YubiKey challenge** - Random challenge each unlock = different response = can't decrypt
2. **No master key** - Each entry encrypted directly with passphrase = can't support multiple unlock paths
3. **Hybrid impossible** - "Same contribution via different paths" is cryptographically nonsensical

## The Correct Architecture

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

## Stable YubiKey Challenge

```
VAULT_ID = random UUID, created at genesis, stored in .vault-id

CHALLENGE = SHA256("codex-vault-v2:" || VAULT_ID)  # Always the same for this vault

RESPONSE = YubiKey.HMAC(CHALLENGE)  # Deterministic for same vault+key

YK_FACTOR = SHA256(RESPONSE)
```

Now the YubiKey contribution is stable and deterministic.

## YubiKey Fingerprint (not serial)

At bind time:
```
YK_FINGERPRINT = SHA256(RESPONSE)[:16]  # First 8 bytes hex
```

At unlock time:
```
current_fp = SHA256(RESPONSE)[:16]
if current_fp != stored_fp: reject
```

This verifies the *actual cryptographic binding*, not just the hardware serial.

## Key Derivation

```
# Software-only unlock
KEK = Argon2id(passphrase, salt, witness_hash)

# With YubiKey  
KEK = Argon2id(passphrase || yk_factor, salt)

# With Keyfile
KEK = Argon2id(passphrase || keyfile_hash, salt)

# Emergency (no physical key)
KEK = Argon2id(passphrase || witness || anchor, emergency_salt)
```

Each KEK unwraps MK from its corresponding envelope.

## File Structure

```
.codex-vault/
├── .vault-id              # UUID, stable challenge source
├── .vault-genesis         # Genesis metadata (DNA, timestamps, etc.)
├── .vault-config          # Settings (parsed, not sourced)
├── .keyring/
│   ├── config             # key_type, fingerprints
│   ├── master.key.pass    # MK wrapped with passphrase+witness
│   ├── master.key.yk      # MK wrapped with passphrase+yk_factor (if bound)
│   ├── master.key.kf      # MK wrapped with passphrase+kf_hash (if bound)
│   └── master.key.em      # MK wrapped with emergency factors (if configured)
├── entries/
│   ├── api/
│   │   └── anthropic.enc  # Encrypted with MK
│   └── passwords/
│       └── github.enc
└── .git/                   # Optional
```

## Unlock Flow

```
1. Detect available factors (YubiKey? Keyfile? Neither?)
2. Select appropriate envelope:
   - YubiKey present → master.key.yk
   - Keyfile present → master.key.kf
   - Neither → master.key.pass (requires witness) or emergency
3. Prompt for passphrase
4. Derive KEK using available factors
5. Unwrap MK from envelope
6. Verify MK by decrypting a known test value
7. Cache MK in session (memory-only)
8. All entry operations use cached MK
```

## Adding a New Key (Hybrid)

```
1. Unlock vault (using any existing method)
2. MK is now in memory
3. User configures new YubiKey/keyfile
4. Compute new factor
5. Derive new KEK
6. Wrap MK with new KEK → create new envelope
7. Store new envelope

Now TWO envelopes can unwrap the same MK.
```

## Revoking a Key

```
1. Unlock vault (using ANY working method)
2. Delete the envelope for the revoked key
3. That key can no longer unwrap MK
```

## Emergency Unlock

```
Factors: passphrase + witness phrase + anchor number
Rate limited: 3 attempts per 24 hours
Logged: timestamp, IP, success/fail
Optional: send alert to configured email/webhook
```

## Why This Works

- **MK never stored plaintext** - Only wrapped copies exist
- **Multiple envelopes = multiple unlock paths** - Add/remove keys without re-encrypting entries
- **Stable challenges** - YubiKey response is deterministic for vault
- **Fingerprint verification** - Cryptographic proof of correct key, not just serial
- **Clean separation** - Factors are combined into KEK, not mixed ad-hoc

## Implementation Notes

### For Bash+GPG (Phase 1)

We can approximate this with GPG symmetric encryption:
- Use `gpg --symmetric` with derived passphrase
- The "envelope" is just a GPG-encrypted copy of MK
- Works, portable, fits the script approach

### For Real App (Phase 2)

Replace GPG with:
- Argon2id for KDF
- XChaCha20-Poly1305 for encryption
- Proper memory zeroization
- Native bindings to YubiKey libraries

The architecture remains the same.
