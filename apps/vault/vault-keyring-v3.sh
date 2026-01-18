#!/usr/bin/env bash
# CODEX-VAULT KEYRING MODULE v3
# 
# Fixes from GPT review:
#   1. KEYRING_DIR is now a directory (not file collision)
#   2. yubikey_challenge() supports both ykman and ykchalresp
#   3. Challenge is 64 bytes (SHA-512, no ambiguity)
#   4. get_physical_factor() returns tagged output (yk:<factor> or kf:<factor>)
#   5. Local keyfile requires --allow-local-keyfile (not silent fallback)
#
# Key insight: Physical factor must produce DETERMINISTIC output
# for the same vault+key combination, or decryption will fail.

set -o pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

VAULT_DIR="${CODEX_VAULT_DIR:-$HOME/.codex-vault}"

# FIX #1: Keyring is a DIRECTORY containing config and envelopes
KEYRING_DIR="$VAULT_DIR/.keyring"
KEYRING_CONFIG="$KEYRING_DIR/config"

# ============================================================================
# CROSS-PLATFORM HELPERS
# ============================================================================

sha256() {
    if command -v sha256sum &>/dev/null; then
        sha256sum | cut -d' ' -f1
    elif command -v shasum &>/dev/null; then
        shasum -a 256 | cut -d' ' -f1
    else
        openssl dgst -sha256 | sed 's/.*= //'
    fi
}

# FIX #3: Use SHA-512 for 64-byte challenges
sha512() {
    if command -v sha512sum &>/dev/null; then
        sha512sum | cut -d' ' -f1
    elif command -v shasum &>/dev/null; then
        shasum -a 512 | cut -d' ' -f1
    else
        openssl dgst -sha512 | sed 's/.*= //'
    fi
}

hex_encode() {
    if command -v xxd &>/dev/null; then
        xxd -p | tr -d '\n'
    else
        od -An -tx1 | tr -d ' \n'
    fi
}

# ============================================================================
# VAULT IDENTITY
# ============================================================================

get_vault_id() {
    local id_file="$VAULT_DIR/.vault-id"
    if [[ -f "$id_file" ]]; then
        cat "$id_file"
    else
        local uuid
        if command -v uuidgen &>/dev/null; then
            uuid=$(uuidgen)
        elif [[ -f /proc/sys/kernel/random/uuid ]]; then
            uuid=$(cat /proc/sys/kernel/random/uuid)
        else
            uuid=$(head -c 16 /dev/urandom | hex_encode)
        fi
        mkdir -p "$VAULT_DIR"
        printf '%s' "$uuid" > "$id_file"
        chmod 600 "$id_file"
        printf '%s' "$uuid"
    fi
}

# FIX #3: STABLE 64-byte challenge (SHA-512 = 128 hex chars)
# This eliminates any "short challenge" mode ambiguity with YubiKey
get_binding_challenge() {
    local vault_id
    vault_id=$(get_vault_id)
    # SHA-512 gives us 64 bytes = 128 hex chars, exactly what challenge-response expects
    printf 'codex-vault-v3:%s' "$vault_id" | sha512
}

# ============================================================================
# YUBIKEY OPERATIONS
# ============================================================================

detect_yubikey() {
    if command -v ykman &>/dev/null; then
        local result
        result=$(ykman list 2>/dev/null | head -1)
        [[ -n "$result" ]] && echo "$result" && return 0
    fi
    
    if command -v ykchalresp &>/dev/null; then
        # Test with a 64-byte dummy challenge
        if ykchalresp -2 -x "$(printf '%0128d' 0)" &>/dev/null; then
            echo "YubiKey detected (ykchalresp)"
            return 0
        fi
    fi
    
    return 1
}

# FIX #2: Support both ykman and ykchalresp properly
yubikey_challenge() {
    local challenge="$1"
    
    if command -v ykman &>/dev/null; then
        # ykman otp calculate expects hex challenge, outputs hex response
        # Slot 2 is typically used for challenge-response
        ykman otp calculate 2 "$challenge" 2>/dev/null | tr -d ' \r\n'
    elif command -v ykchalresp &>/dev/null; then
        # ykchalresp -2 = slot 2, -x = hex input
        ykchalresp -2 -x "$challenge" 2>/dev/null | tr -d ' \r\n'
    else
        return 1
    fi
}

get_yubikey_factor() {
    local challenge
    challenge=$(get_binding_challenge)
    
    local response
    response=$(yubikey_challenge "$challenge")
    [[ -z "$response" ]] && return 1
    
    # Factor is SHA-256 of the response (gives us 32 bytes for key derivation)
    printf '%s' "$response" | sha256
}

get_yubikey_fingerprint() {
    local factor
    factor=$(get_yubikey_factor) || return 1
    # First 16 hex chars = 8 bytes
    printf '%s' "${factor:0:16}"
}

configure_yubikey() {
    if ! command -v ykman &>/dev/null; then
        echo "ykman required for configuration" >&2
        return 1
    fi
    
    echo -e "${YELLOW}Configuring YubiKey Slot 2 for challenge-response...${NC}"
    echo -e "${DIM}(Touch will be required for each unlock)${NC}"
    
    # --touch requires physical touch, --generate creates random secret
    if ! ykman otp chalresp --touch --generate 2 --force 2>&1; then
        echo -e "${RED}Configuration failed${NC}" >&2
        return 1
    fi
    
    echo -e "${GREEN}✓ YubiKey Slot 2 configured${NC}"
}

# ============================================================================
# KEYFILE OPERATIONS  
# ============================================================================

# FIX #5: Separate local vs removable keyfile detection
detect_keyfile_removable() {
    # Only search removable media paths
    local patterns=(
        "/media/$USER/*/.codex-key"
        "/media/*/.codex-key"
        "/mnt/*/.codex-key"
        "/run/media/$USER/*/.codex-key"
        "/Volumes/*/.codex-key"
    )
    
    local f
    for pattern in "${patterns[@]}"; do
        while IFS= read -r -d '' f; do
            [[ -f "$f" ]] && printf '%s' "$f" && return 0
        done < <(compgen -G "$pattern" 2>/dev/null | tr '\n' '\0')
    done
    return 1
}

detect_keyfile_local() {
    # Local vault directory keyfile (only if explicitly allowed)
    [[ -f "$VAULT_DIR/.codex-key" ]] && printf '%s' "$VAULT_DIR/.codex-key" && return 0
    return 1
}

detect_keyfile() {
    local allow_local="${ALLOW_LOCAL_KEYFILE:-false}"
    
    # Always prefer removable media
    local removable
    removable=$(detect_keyfile_removable)
    if [[ -n "$removable" ]]; then
        printf '%s' "$removable"
        return 0
    fi
    
    # Only check local if explicitly allowed
    if [[ "$allow_local" == "true" ]]; then
        local local_kf
        local_kf=$(detect_keyfile_local)
        if [[ -n "$local_kf" ]]; then
            printf '%s' "$local_kf"
            return 0
        fi
    fi
    
    return 1
}

get_keyfile_factor() {
    local keyfile="$1"
    [[ -f "$keyfile" ]] || return 1
    sha256 < "$keyfile"
}

get_keyfile_fingerprint() {
    local keyfile="$1"
    local factor
    factor=$(get_keyfile_factor "$keyfile") || return 1
    printf '%s' "${factor:0:16}"
}

generate_keyfile() {
    local path="$1"
    mkdir -p "$(dirname "$path")"
    head -c 32 /dev/urandom > "$path"
    chmod 400 "$path"
    echo -e "${GREEN}✓ Keyfile generated: $path${NC}"
}

# ============================================================================
# CONFIGURATION (safe parsing, no source)
# ============================================================================

load_keyring_config() {
    key_type="none"
    yubikey_fingerprint=""
    keyfile_fingerprint=""
    require_physical="false"
    allow_local_keyfile="false"
    
    [[ -f "$KEYRING_CONFIG" ]] || return 0
    [[ -O "$KEYRING_CONFIG" ]] || { echo "Config not owned by user" >&2; return 1; }
    
    while IFS='=' read -r key value; do
        [[ "$key" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$key" ]] && continue
        key="${key//[[:space:]]/}"
        value="${value#"${value%%[![:space:]]*}"}"
        value="${value%"${value##*[![:space:]]}"}"
        
        case "$key" in
            key_type) key_type="$value" ;;
            yubikey_fingerprint) yubikey_fingerprint="$value" ;;
            keyfile_fingerprint) keyfile_fingerprint="$value" ;;
            require_physical) require_physical="$value" ;;
            allow_local_keyfile) allow_local_keyfile="$value" ;;
        esac
    done < "$KEYRING_CONFIG"
    
    # Export for detect_keyfile()
    export ALLOW_LOCAL_KEYFILE="$allow_local_keyfile"
}

save_keyring_config() {
    mkdir -p "$KEYRING_DIR"
    chmod 700 "$KEYRING_DIR"
    
    cat > "$KEYRING_CONFIG" << CONFIG
# CODEX-VAULT Keyring Configuration v3
# Generated: $(date -Iseconds)
key_type=$key_type
yubikey_fingerprint=$yubikey_fingerprint
keyfile_fingerprint=$keyfile_fingerprint
require_physical=$require_physical
allow_local_keyfile=$allow_local_keyfile
CONFIG
    chmod 600 "$KEYRING_CONFIG"
}

# ============================================================================
# FIX #4: TAGGED PHYSICAL FACTOR
# Returns: "yk:<factor>" or "kf:<factor>" or "none:<empty>"
# This lets the caller know which envelope to use
# ============================================================================

get_physical_factor() {
    load_keyring_config
    
    case "$key_type" in
        none)
            printf 'none:'
            return 0
            ;;
            
        yubikey)
            local factor
            factor=$(get_yubikey_factor) || { echo "YubiKey challenge failed" >&2; return 1; }
            local fp="${factor:0:16}"
            if [[ "$fp" != "$yubikey_fingerprint" ]]; then
                echo "Wrong YubiKey (fingerprint mismatch)" >&2
                return 1
            fi
            printf 'yk:%s' "$factor"
            ;;
            
        keyfile)
            local kf
            kf=$(detect_keyfile) || { echo "No keyfile found" >&2; return 1; }
            local factor
            factor=$(get_keyfile_factor "$kf")
            local fp="${factor:0:16}"
            if [[ "$fp" != "$keyfile_fingerprint" ]]; then
                echo "Wrong keyfile (fingerprint mismatch)" >&2
                return 1
            fi
            printf 'kf:%s' "$factor"
            ;;
            
        hybrid)
            # Try YubiKey first, then keyfile
            # Return whichever succeeds with correct fingerprint
            
            if detect_yubikey &>/dev/null; then
                local yk_factor
                yk_factor=$(get_yubikey_factor 2>/dev/null)
                if [[ -n "$yk_factor" && "${yk_factor:0:16}" == "$yubikey_fingerprint" ]]; then
                    printf 'yk:%s' "$yk_factor"
                    return 0
                fi
            fi
            
            local kf
            kf=$(detect_keyfile 2>/dev/null)
            if [[ -n "$kf" ]]; then
                local kf_factor
                kf_factor=$(get_keyfile_factor "$kf")
                if [[ "${kf_factor:0:16}" == "$keyfile_fingerprint" ]]; then
                    printf 'kf:%s' "$kf_factor"
                    return 0
                fi
            fi
            
            echo "No valid physical key available" >&2
            return 1
            ;;
            
        *)
            echo "Unknown key_type: $key_type" >&2
            return 1
            ;;
    esac
}

# Helper to extract just the factor (strips tag)
get_factor_value() {
    local tagged="$1"
    printf '%s' "${tagged#*:}"
}

# Helper to extract just the tag
get_factor_type() {
    local tagged="$1"
    printf '%s' "${tagged%%:*}"
}

# ============================================================================
# KEY DERIVATION
# ============================================================================

derive_key() {
    local passphrase="$1"
    local physical_factor="$2"  # Already untagged
    local witness_hash="${3:-}"
    
    local combined
    if [[ -n "$witness_hash" ]]; then
        combined="${passphrase}:${physical_factor}:${witness_hash}"
    elif [[ -n "$physical_factor" ]]; then
        combined="${passphrase}:${physical_factor}"
    else
        combined="${passphrase}"
    fi
    
    local salt
    salt=$(get_vault_id)
    
    # Simple iterative stretching (use argon2 in production)
    local key="$combined"
    local i
    for ((i=0; i<10000; i++)); do
        key=$(printf '%s:%s:%d' "$key" "$salt" "$i" | sha256)
    done
    
    printf '%s' "$key"
}

# ============================================================================
# SETUP WIZARDS
# ============================================================================

setup_yubikey() {
    echo -e "${BLUE}${BOLD}YubiKey Setup${NC}"
    
    if ! detect_yubikey &>/dev/null; then
        read -rp "Insert YubiKey and press ENTER..."
    fi
    
    if ! detect_yubikey &>/dev/null; then
        echo -e "${RED}No YubiKey detected${NC}"
        return 1
    fi
    
    echo -e "Detected: ${GREEN}$(detect_yubikey)${NC}"
    echo -e "${YELLOW}Warning: This will overwrite Slot 2 configuration${NC}"
    read -rp "Configure Slot 2 for challenge-response? [y/N]: " confirm
    [[ "$confirm" =~ ^[Yy] ]] || return 1
    
    configure_yubikey || return 1
    sleep 1
    
    local fp
    fp=$(get_yubikey_fingerprint) || { echo "Failed to get fingerprint" >&2; return 1; }
    yubikey_fingerprint="$fp"
    echo -e "${GREEN}✓ YubiKey bound${NC}"
    echo -e "  Fingerprint: ${CYAN}$fp${NC}"
}

setup_keyfile() {
    echo -e "${BLUE}${BOLD}Keyfile Setup${NC}"
    echo ""
    echo "Where should the keyfile be created?"
    echo -e "  ${DIM}[1] Removable media (recommended - true physical factor)${NC}"
    echo -e "  ${DIM}[2] Local vault directory (not a true possession factor)${NC}"
    echo ""
    
    read -rp "Selection [1]: " sel
    sel="${sel:-1}"
    
    local keyfile
    case "$sel" in
        1)
            echo ""
            echo "Available mount points:"
            local mounts=()
            while IFS= read -r mount; do
                [[ -d "$mount" && -w "$mount" ]] && mounts+=("$mount")
            done < <(find /media /mnt /Volumes /run/media 2>/dev/null -maxdepth 2 -type d)
            
            if [[ ${#mounts[@]} -eq 0 ]]; then
                echo -e "${YELLOW}No writable removable media found.${NC}"
                echo "Insert a USB drive and try again, or choose local."
                return 1
            fi
            
            local i=1
            for m in "${mounts[@]}"; do
                echo "  [$i] $m"
                ((i++))
            done
            
            read -rp "Selection [1]: " msel
            msel="${msel:-1}"
            local target="${mounts[$((msel-1))]}"
            keyfile="$target/.codex-key"
            ;;
        2)
            echo -e "${YELLOW}Warning: Local keyfile is not a true possession factor.${NC}"
            read -rp "Continue anyway? [y/N]: " confirm
            [[ "$confirm" =~ ^[Yy] ]] || return 1
            keyfile="$VAULT_DIR/.codex-key"
            allow_local_keyfile="true"
            ;;
        *)
            return 1
            ;;
    esac
    
    generate_keyfile "$keyfile"
    
    local fp
    fp=$(get_keyfile_fingerprint "$keyfile")
    keyfile_fingerprint="$fp"
    echo -e "  Fingerprint: ${CYAN}$fp${NC}"
}

keyring_ceremony() {
    # Ensure vault ID exists
    get_vault_id > /dev/null
    
    echo -e "${MAGENTA}${BOLD}═══════════════════════════════════════${NC}"
    echo -e "${MAGENTA}${BOLD}    CHANNEL 6: THE KEYRING CEREMONY    ${NC}"
    echo -e "${MAGENTA}${BOLD}═══════════════════════════════════════${NC}"
    echo ""
    echo "Physical factors add possession-based security to your vault."
    echo "Even if someone learns your passphrase, they need the physical"
    echo "key to unlock."
    echo ""
    echo "  [1] YubiKey only     (hardware token, touch required)"
    echo "  [2] Keyfile only     (file on USB drive)"
    echo "  [3] Hybrid           (either works - redundant backup)"
    echo "  [4] None             (passphrase only)"
    echo ""
    
    read -rp "Selection [1-4]: " sel
    
    # Reset
    key_type="none"
    require_physical="false"
    allow_local_keyfile="false"
    yubikey_fingerprint=""
    keyfile_fingerprint=""
    
    case "$sel" in
        1)
            if setup_yubikey; then
                key_type="yubikey"
                require_physical="true"
            else
                return 1
            fi
            ;;
        2)
            if setup_keyfile; then
                key_type="keyfile"
                require_physical="true"
            else
                return 1
            fi
            ;;
        3)
            echo -e "\n${BOLD}Setting up YubiKey...${NC}"
            setup_yubikey
            local yk_ok=$?
            
            echo -e "\n${BOLD}Setting up Keyfile...${NC}"
            setup_keyfile
            local kf_ok=$?
            
            if [[ $yk_ok -eq 0 || $kf_ok -eq 0 ]]; then
                key_type="hybrid"
                require_physical="true"
            else
                echo -e "${RED}At least one physical factor required for hybrid${NC}"
                return 1
            fi
            ;;
        4)
            key_type="none"
            require_physical="false"
            echo -e "${YELLOW}Vault will use passphrase only (no physical factor)${NC}"
            ;;
        *)
            return 1
            ;;
    esac
    
    save_keyring_config
    echo -e "\n${GREEN}✓ Keyring configuration saved${NC}"
}

keyring_status() {
    load_keyring_config
    
    echo -e "${CYAN}${BOLD}Keyring Status${NC}"
    echo "  Type:            $key_type"
    echo "  Require physical: $require_physical"
    echo "  Allow local KF:  $allow_local_keyfile"
    
    if [[ -n "$yubikey_fingerprint" ]]; then
        echo "  YubiKey FP:      $yubikey_fingerprint"
        if detect_yubikey &>/dev/null; then
            local current_fp
            current_fp=$(get_yubikey_fingerprint 2>/dev/null)
            if [[ "$current_fp" == "$yubikey_fingerprint" ]]; then
                echo -e "                   ${GREEN}(present, verified)${NC}"
            else
                echo -e "                   ${YELLOW}(present, different key!)${NC}"
            fi
        else
            echo -e "                   ${DIM}(not present)${NC}"
        fi
    fi
    
    if [[ -n "$keyfile_fingerprint" ]]; then
        echo "  Keyfile FP:      $keyfile_fingerprint"
        local kf
        kf=$(detect_keyfile 2>/dev/null)
        if [[ -n "$kf" ]]; then
            local current_fp
            current_fp=$(get_keyfile_fingerprint "$kf" 2>/dev/null)
            if [[ "$current_fp" == "$keyfile_fingerprint" ]]; then
                echo -e "                   ${GREEN}(found: $kf)${NC}"
            else
                echo -e "                   ${YELLOW}(found but wrong fingerprint)${NC}"
            fi
        else
            echo -e "                   ${DIM}(not found)${NC}"
        fi
    fi
}

# ============================================================================
# MAIN
# ============================================================================

[[ "${BASH_SOURCE[0]}" == "${0}" ]] && {
    case "${1:-status}" in
        status)     keyring_status ;;
        ceremony)   keyring_ceremony ;;
        factor)     get_physical_factor ;;
        derive)     derive_key "$2" "$3" "$4" ;;
        challenge)  get_binding_challenge ;;
        test-yk)
            echo "Testing YubiKey..."
            detect_yubikey && echo "Detected: $(detect_yubikey)"
            echo "Challenge (first 32 chars): $(get_binding_challenge | cut -c1-32)..."
            echo "Factor: $(get_yubikey_factor 2>&1 || echo 'FAILED')"
            ;;
        *)
            echo "Usage: $0 {status|ceremony|factor|derive|challenge|test-yk}"
            ;;
    esac
}
