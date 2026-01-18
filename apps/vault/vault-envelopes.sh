#!/usr/bin/env bash
# CODEX-VAULT ENVELOPE MODULE
#
# Implements the multi-envelope Master Key architecture:
#
# ╔═══════════════════════════════════════════════════════════════════╗
# ║  KEK - Key Encryption Key (standard cryptographic terminology)    ║
# ║                                                                   ║
# ║  Also: Kek (𓆏) - Ancient Egyptian frog deity of primordial      ║
# ║  chaos and darkness, one of the Ogdoad, bringer of light from    ║
# ║  the waters of Nu. The frog who guards the threshold.            ║
# ║                                                                   ║
# ║  The cryptographers named it this by accident.                    ║
# ║  We recognize the synchronicity.                                  ║
# ║                                                                   ║
# ║  Your keys are guarded by the frog god of chaos.                  ║
# ║  This is not a joke. This is actually how cryptography works.     ║
# ╚═══════════════════════════════════════════════════════════════════╝
#
#   - MK is generated once at vault creation (32 bytes, random)
#   - MK is wrapped into multiple envelopes (one per auth method)
#   - Any envelope can unwrap MK if you have the right factors
#   - MK never stored plaintext - only wrapped copies exist
#
# Envelope types:
#   master.key.pass - wrapped with KEK(passphrase + witness)
#   master.key.yk   - wrapped with KEK(passphrase + yubikey_factor)
#   master.key.kf   - wrapped with KEK(passphrase + keyfile_factor)
#   master.key.em   - wrapped with KEK(passphrase + witness + anchor) [emergency]

set -o pipefail

VAULT_DIR="${CODEX_VAULT_DIR:-$HOME/.codex-vault}"
KEYRING_DIR="$VAULT_DIR/.keyring"
MK_CHECK_FILE="$KEYRING_DIR/.mk-check"

# Source the keyring module (must be in same directory or PATH)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/vault-keyring-v3.sh" ]]; then
    source "$SCRIPT_DIR/vault-keyring-v3.sh"
elif [[ -f "$SCRIPT_DIR/vault-keyring.sh" ]]; then
    source "$SCRIPT_DIR/vault-keyring.sh"
fi

# Colors (may already be defined by keyring)
RED="${RED:-\033[0;31m}"
GREEN="${GREEN:-\033[0;32m}"
YELLOW="${YELLOW:-\033[1;33m}"
CYAN="${CYAN:-\033[0;36m}"
NC="${NC:-\033[0m}"

# GPG options for symmetric encryption
GPG_OPTS="--batch --yes --quiet --pinentry-mode loopback"

# ============================================================================
# MASTER KEY OPERATIONS
# ============================================================================

generate_master_key() {
    # 32 bytes = 256 bits, suitable for AES-256
    head -c 32 /dev/urandom | xxd -p | tr -d '\n'
}

# Wrap MK with a derived key (creates envelope)
wrap_master_key() {
    local mk="$1"
    local kek="$2"
    local envelope_path="$3"
    
    mkdir -p "$(dirname "$envelope_path")"
    
    # Use GPG symmetric encryption with the KEK as passphrase
    printf '%s' "$mk" | gpg $GPG_OPTS \
        --symmetric --cipher-algo AES256 --armor \
        --passphrase "$kek" \
        -o "$envelope_path"
    
    chmod 600 "$envelope_path"
}

# Unwrap MK from envelope using derived key
unwrap_master_key() {
    local kek="$1"
    local envelope_path="$2"
    
    [[ -f "$envelope_path" ]] || return 1
    
    gpg $GPG_OPTS --decrypt --passphrase "$kek" "$envelope_path" 2>/dev/null
}

# Store a verification value encrypted with MK
# This lets us verify MK was correctly unwrapped
create_mk_check() {
    local mk="$1"
    
    printf 'CODEX-MK-OK:%s' "$(date +%s)" | gpg $GPG_OPTS \
        --symmetric --cipher-algo AES256 --armor \
        --passphrase "$mk" \
        -o "$MK_CHECK_FILE"
    
    chmod 600 "$MK_CHECK_FILE"
}

verify_master_key() {
    local mk="$1"
    
    [[ -f "$MK_CHECK_FILE" ]] || return 1
    
    local check
    check=$(gpg $GPG_OPTS --decrypt --passphrase "$mk" "$MK_CHECK_FILE" 2>/dev/null)
    
    [[ "$check" == CODEX-MK-OK:* ]]
}

# ============================================================================
# ENVELOPE MANAGEMENT
# ============================================================================

get_envelope_path() {
    local type="$1"  # pass, yk, kf, em
    printf '%s/master.key.%s' "$KEYRING_DIR" "$type"
}

envelope_exists() {
    local type="$1"
    [[ -f "$(get_envelope_path "$type")" ]]
}

list_envelopes() {
    local envelopes=()
    for type in pass yk kf em; do
        envelope_exists "$type" && envelopes+=("$type")
    done
    printf '%s\n' "${envelopes[@]}"
}

# Create envelope for passphrase-only unlock (with witness)
create_envelope_pass() {
    local mk="$1"
    local passphrase="$2"
    local witness_hash="$3"
    
    # Invoke the Key Encryption Key (𓆏 Kek guards the threshold)
    local kek
    kek=$(derive_key "$passphrase" "" "$witness_hash")
    
    wrap_master_key "$mk" "$kek" "$(get_envelope_path pass)"
    echo -e "${GREEN}✓ Created passphrase envelope (Kek stands watch)${NC}"
}

# Create envelope for YubiKey unlock
create_envelope_yk() {
    local mk="$1"
    local passphrase="$2"
    local yk_factor="$3"
    
    # The frog god accepts the hardware token's offering
    local kek
    kek=$(derive_key "$passphrase" "$yk_factor" "")
    
    wrap_master_key "$mk" "$kek" "$(get_envelope_path yk)"
    echo -e "${GREEN}✓ Created YubiKey envelope (Kek acknowledges the token)${NC}"
}

# Create envelope for keyfile unlock
create_envelope_kf() {
    local mk="$1"
    local passphrase="$2"
    local kf_factor="$3"
    
    local kek
    kek=$(derive_key "$passphrase" "$kf_factor" "")
    
    wrap_master_key "$mk" "$kek" "$(get_envelope_path kf)"
    echo -e "${GREEN}✓ Created keyfile envelope${NC}"
}

# Create emergency envelope (passphrase + witness + anchor)
create_envelope_emergency() {
    local mk="$1"
    local passphrase="$2"
    local witness_hash="$3"
    local anchor="$4"
    
    # Emergency combines all recovery factors
    local combined="${witness_hash}:${anchor}"
    local kek
    kek=$(derive_key "$passphrase" "$combined" "emergency")
    
    wrap_master_key "$mk" "$kek" "$(get_envelope_path em)"
    echo -e "${GREEN}✓ Created emergency envelope${NC}"
}

# ============================================================================
# UNLOCK FLOW
# ============================================================================

# Try to unwrap MK using available factors
# Returns MK on stdout if successful
attempt_unlock() {
    local passphrase="$1"
    local witness_hash="${2:-}"
    local anchor="${3:-}"
    
    load_keyring_config
    
    local mk
    
    # Get physical factor (tagged: yk:xxx or kf:xxx or none:)
    local tagged_factor
    tagged_factor=$(get_physical_factor 2>/dev/null) || tagged_factor="none:"
    
    local factor_type
    factor_type=$(get_factor_type "$tagged_factor")
    
    local factor_value
    factor_value=$(get_factor_value "$tagged_factor")
    
    # Try envelopes in priority order based on available factors
    
    # 1. If YubiKey available and envelope exists, try it first
    if [[ "$factor_type" == "yk" ]] && envelope_exists yk; then
        local kek
        kek=$(derive_key "$passphrase" "$factor_value" "")
        mk=$(unwrap_master_key "$kek" "$(get_envelope_path yk)")
        if [[ -n "$mk" ]] && verify_master_key "$mk"; then
            printf '%s' "$mk"
            return 0
        fi
    fi
    
    # 2. If keyfile available and envelope exists, try it
    if [[ "$factor_type" == "kf" ]] && envelope_exists kf; then
        local kek
        kek=$(derive_key "$passphrase" "$factor_value" "")
        mk=$(unwrap_master_key "$kek" "$(get_envelope_path kf)")
        if [[ -n "$mk" ]] && verify_master_key "$mk"; then
            printf '%s' "$mk"
            return 0
        fi
    fi
    
    # 3. Try passphrase-only envelope (requires witness)
    if envelope_exists pass && [[ -n "$witness_hash" ]]; then
        local kek
        kek=$(derive_key "$passphrase" "" "$witness_hash")
        mk=$(unwrap_master_key "$kek" "$(get_envelope_path pass)")
        if [[ -n "$mk" ]] && verify_master_key "$mk"; then
            printf '%s' "$mk"
            return 0
        fi
    fi
    
    # 4. Try emergency envelope (requires witness + anchor)
    if envelope_exists em && [[ -n "$witness_hash" && -n "$anchor" ]]; then
        local combined="${witness_hash}:${anchor}"
        local kek
        kek=$(derive_key "$passphrase" "$combined" "emergency")
        mk=$(unwrap_master_key "$kek" "$(get_envelope_path em)")
        if [[ -n "$mk" ]] && verify_master_key "$mk"; then
            echo -e "${YELLOW}⚠ Unlocked via emergency envelope${NC}" >&2
            printf '%s' "$mk"
            return 0
        fi
    fi
    
    return 1
}

# ============================================================================
# VAULT INITIALIZATION (Creates MK and initial envelopes)
# ============================================================================

init_envelopes() {
    local passphrase="$1"
    local witness_hash="${2:-}"
    local anchor="${3:-}"
    
    # Check if already initialized
    if [[ -f "$MK_CHECK_FILE" ]]; then
        echo -e "${RED}Vault already has a master key${NC}" >&2
        return 1
    fi
    
    # Generate new master key
    local mk
    mk=$(generate_master_key)
    
    echo -e "${CYAN}Generated new master key${NC}"
    
    # Create MK verification file
    create_mk_check "$mk"
    
    # Load keyring config to see what physical factors are configured
    load_keyring_config
    
    # Always create passphrase envelope if witness provided
    if [[ -n "$witness_hash" ]]; then
        create_envelope_pass "$mk" "$passphrase" "$witness_hash"
    fi
    
    # Create physical factor envelopes based on keyring config
    case "$key_type" in
        yubikey)
            local yk_factor
            yk_factor=$(get_yubikey_factor) || { echo "YubiKey required" >&2; return 1; }
            create_envelope_yk "$mk" "$passphrase" "$yk_factor"
            ;;
        keyfile)
            local kf
            kf=$(detect_keyfile) || { echo "Keyfile required" >&2; return 1; }
            local kf_factor
            kf_factor=$(get_keyfile_factor "$kf")
            create_envelope_kf "$mk" "$passphrase" "$kf_factor"
            ;;
        hybrid)
            # Try to create both if available
            local yk_factor
            yk_factor=$(get_yubikey_factor 2>/dev/null)
            if [[ -n "$yk_factor" ]]; then
                create_envelope_yk "$mk" "$passphrase" "$yk_factor"
            fi
            
            local kf
            kf=$(detect_keyfile 2>/dev/null)
            if [[ -n "$kf" ]]; then
                local kf_factor
                kf_factor=$(get_keyfile_factor "$kf")
                create_envelope_kf "$mk" "$passphrase" "$kf_factor"
            fi
            ;;
        none)
            # passphrase envelope only (already created above if witness provided)
            if [[ -z "$witness_hash" ]]; then
                echo -e "${YELLOW}Warning: No witness provided and no physical factor.${NC}" >&2
                echo -e "${YELLOW}Creating passphrase-only envelope (less secure).${NC}" >&2
                create_envelope_pass "$mk" "$passphrase" "none"
            fi
            ;;
    esac
    
    # Create emergency envelope if anchor provided
    if [[ -n "$witness_hash" && -n "$anchor" ]]; then
        create_envelope_emergency "$mk" "$passphrase" "$witness_hash" "$anchor"
    fi
    
    # Clear MK from memory (best effort in bash)
    mk="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    unset mk
    
    echo -e "${GREEN}✓ Master key wrapped in $(list_envelopes | wc -l) envelope(s)${NC}"
    echo -e "${DIM}Envelopes: $(list_envelopes | tr '\n' ' ')${NC}"
}

# ============================================================================
# ADD/REMOVE ENVELOPES (for existing vault)
# ============================================================================

add_envelope() {
    local type="$1"
    local passphrase="$2"
    
    # Must unlock vault first to get MK
    local mk
    mk=$(attempt_unlock "$passphrase" "$3" "$4")
    [[ -z "$mk" ]] && { echo "Could not unlock vault" >&2; return 1; }
    
    case "$type" in
        yk)
            local yk_factor
            yk_factor=$(get_yubikey_factor) || { echo "YubiKey required" >&2; return 1; }
            create_envelope_yk "$mk" "$passphrase" "$yk_factor"
            ;;
        kf)
            local kf
            kf=$(detect_keyfile) || { echo "Keyfile required" >&2; return 1; }
            local kf_factor
            kf_factor=$(get_keyfile_factor "$kf")
            create_envelope_kf "$mk" "$passphrase" "$kf_factor"
            ;;
        *)
            echo "Unknown envelope type: $type" >&2
            return 1
            ;;
    esac
    
    # Clear MK
    mk="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}

revoke_envelope() {
    local type="$1"
    
    local path
    path=$(get_envelope_path "$type")
    
    if [[ ! -f "$path" ]]; then
        echo "Envelope does not exist: $type" >&2
        return 1
    fi
    
    # Safety check: don't revoke last envelope
    local count
    count=$(list_envelopes | wc -l)
    if [[ "$count" -le 1 ]]; then
        echo -e "${RED}Cannot revoke last envelope - vault would be permanently locked${NC}" >&2
        return 1
    fi
    
    # Secure delete
    if command -v shred &>/dev/null; then
        shred -u "$path"
    else
        dd if=/dev/urandom of="$path" bs=1024 count=1 2>/dev/null
        rm -f "$path"
    fi
    
    echo -e "${GREEN}✓ Revoked envelope: $type${NC}"
}

# ============================================================================
# STATUS
# ============================================================================

envelope_status() {
    echo -e "${CYAN}${BOLD}Envelope Status${NC}"
    echo -e "${DIM}  𓆏 KEK (Key Encryption Key) guards the threshold${NC}"
    echo ""
    
    if [[ ! -f "$MK_CHECK_FILE" ]]; then
        echo -e "${YELLOW}No master key initialized${NC}"
        return
    fi
    
    echo "Available envelopes:"
    for type in pass yk kf em; do
        local path
        path=$(get_envelope_path "$type")
        if [[ -f "$path" ]]; then
            local desc
            case "$type" in
                pass) desc="Passphrase + Witness" ;;
                yk)   desc="Passphrase + YubiKey" ;;
                kf)   desc="Passphrase + Keyfile" ;;
                em)   desc="Emergency (all factors)" ;;
            esac
            echo -e "  ${GREEN}●${NC} $type - $desc"
        else
            echo -e "  ${DIM}○ $type - (not configured)${NC}"
        fi
    done
}

# ============================================================================
# MAIN
# ============================================================================

[[ "${BASH_SOURCE[0]}" == "${0}" ]] && {
    case "${1:-status}" in
        status)
            envelope_status
            ;;
        init)
            # init <passphrase> [witness_hash] [anchor]
            init_envelopes "$2" "$3" "$4"
            ;;
        unlock)
            # unlock <passphrase> [witness_hash] [anchor]
            mk=$(attempt_unlock "$2" "$3" "$4")
            if [[ -n "$mk" ]]; then
                echo "MK: ${mk:0:8}...${mk: -8} (truncated)"
            else
                echo "Unlock failed" >&2
                exit 1
            fi
            ;;
        add)
            # add <type> <passphrase> [witness_hash] [anchor]
            add_envelope "$2" "$3" "$4" "$5"
            ;;
        revoke)
            # revoke <type>
            revoke_envelope "$2"
            ;;
        list)
            list_envelopes
            ;;
        *)
            echo "Usage: $0 {status|init|unlock|add|revoke|list}"
            echo ""
            echo "  status                           Show envelope status"
            echo "  init <pass> [witness] [anchor]   Initialize vault MK"
            echo "  unlock <pass> [witness] [anchor] Attempt unlock"
            echo "  add <type> <pass> [witness]      Add envelope (yk|kf)"
            echo "  revoke <type>                    Remove envelope"
            echo "  list                             List active envelopes"
            ;;
    esac
}
