/**
 * HINENI HUB - Portal Integration v2.6
 * Renders the hub inventory as categorized cards inside the DIN Portal
 *
 * Mount point: /Volumes/HINENI_HUB (macOS) | E:\ (Windows - HINENI_HUB_PC)
 * This script injects into #hineni-hub-section
 *
 * Updated: 2026-02-18 - Reorganized into focused categories, removed duplicates and unavailable items
 *
 * PLATFORM BEHAVIOR:
 *   macOS:   Full hub access when HINENI_HUB mounted at /Volumes/HINENI_HUB
 *   Windows: Full hub access when HINENI_HUB_PC drive mounted at E:\
 *   Linux:   Hub items unavailable (no mount point defined)
 *
 * Local apps (isLocal: true) work on ALL platforms.
 */
(function() {

    /**
     * Load CODEX apps from JSON manifest
     */
    var CODEX_APPS_LOADED = false;
    var CODEX_APPS = [];

    async function loadCodexApps() {
        if (CODEX_APPS_LOADED) return CODEX_APPS;

        try {
            const response = await fetch('codex-apps.json');
            if (response.ok) {
                CODEX_APPS = await response.json();
                CODEX_APPS_LOADED = true;
                console.log('✅ Loaded ' + CODEX_APPS.length + ' apps from codex-apps.json');
                return CODEX_APPS;
            }
        } catch (error) {
            console.warn('⚠️  Could not load codex-apps.json:', error);
        }
        return [];
    }

    'use strict';

    // ═══════════════════════════════════════════════════════════════════
    // PLATFORM DETECTION
    // ═══════════════════════════════════════════════════════════════════
    var PLATFORM = (function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('win') !== -1) return 'windows';
        if (ua.indexOf('mac') !== -1) return 'macos';
        if (ua.indexOf('linux') !== -1) return 'linux';
        return 'unknown';
    })();

    var IS_WINDOWS = PLATFORM === 'windows';
    var IS_MACOS = PLATFORM === 'macos';

    // For file:// links that need to open in Finder/Explorer
    // On macOS: /Volumes/HINENI_HUB
    // On Windows: E: (HINENI_HUB_PC drive)
    var HUB_ROOT = IS_MACOS ? '/Volumes/HINENI_HUB' : (IS_WINDOWS ? 'E:' : null);

    // For relative links (portal is at 10-repos-central/CODEX-MONAD/)
    // So ../../ gets us to HINENI_HUB root (only relevant when hub is mounted)
    var RELATIVE_ROOT = '../..';

    // Hub availability - external items work when hub is mounted
    var HUB_AVAILABLE = IS_MACOS || IS_WINDOWS;

    // Windows path prefix for deep archive location
    var WIN_GITHUB_BASE = '20-archive/cloud-mirrors/OneDrive/New Folder With Items/Documents/GitHub';
    var WIN_DESKTOP_BASE = '20-archive/cloud-mirrors/OneDrive/New Folder With Items/Desktop/Desktop Cleanup';

    // Hub items organized by category - ALL REAL TOOLS
    var HUB_CATEGORIES = [
        {
            id: 'core-apps',
            title: '✍️ Core Writing & Communication',
            items: [
                {
                    id: 'polywrite',
                    label: 'PolyWrite Pro',
                    icon: '✍️',
                    status: 'active',
                    description: 'Multi-editor writing environment with session restore, focus mode, and markdown preview.',
                    hubPath: 'apps/polywrite/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'pearl',
                    label: 'Pearl',
                    icon: '💎',
                    status: 'active',
                    description: 'Minimalist AI conversation interface and writing companion for focused dialogue',
                    hubPath: 'apps/pearl/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'codex-monad',
                    label: 'Codex Monad Seedline',
                    icon: '🌱',
                    status: 'active',
                    description: 'The foundational entry point to the CODEX-MONAD ecosystem',
                    hubPath: 'apps/codex_monad/START_HERE.html',
                    launchType: 'html',
                    isLocal: true
                }
            ]
        },
        {
            id: 'security-archival',
            title: '🔐 Security & Archival',
            items: [
                {
                    id: 'codex-ark',
                    label: 'CODEX-ARK Witness',
                    icon: '📦',
                    status: 'active',
                    description: 'Visual tamper detection and archival witness system - cryptographic fingerprints you recognize by sight',
                    hubPath: 'apps/codex-ark/codex-ark-witness.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'vault',
                    label: 'CODEX Vault',
                    icon: '🔐',
                    status: 'active',
                    description: 'Portable secret store with KEK envelope architecture. Guarded by Kek.',
                    hubPath: 'apps/vault/index.html',
                    launchType: 'html',
                    isLocal: true,
                    command: 'vault-v2 status'
                },
                {
                    id: 'serpent',
                    label: 'Serpent',
                    icon: '🐍',
                    status: 'active',
                    description: 'AES-256 encryption and metadata cleansing',
                    hubPath: 'apps/serpent/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'qr-whisper',
                    label: 'QR Whisper',
                    icon: '🔮',
                    status: 'active',
                    description: 'Offline QR encoder/decoder with encryption',
                    hubPath: 'apps/qr-whisper/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'compress',
                    label: 'Compress',
                    icon: '📀',
                    status: 'active',
                    description: 'Archival prep and floppy distribution',
                    hubPath: 'apps/compress/index.html',
                    launchType: 'html',
                    isLocal: true
                }
            ]
        },
        {
            id: 'navigation-exploration',
            title: '🧭 Navigation & Exploration',
            items: [
                {
                    id: 'din-portal',
                    label: 'DIN Portal',
                    icon: '🚪',
                    status: 'active',
                    description: 'Dynamic Intelligent Navigation portal for CODEX ecosystem exploration',
                    hubPath: 'apps/din_portal/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'hypergraph',
                    label: 'Hypergraph Navigator',
                    icon: '🕸️',
                    status: 'active',
                    description: 'Navigate thought networks in N-dimensional space.',
                    hubPath: 'hypergraph.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'oracle-page',
                    label: 'Oracle',
                    icon: '🔮',
                    status: 'active',
                    description: 'Direct consciousness query interface.',
                    hubPath: 'oracle.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'grok-integration',
                    label: 'Grok Integration Demo',
                    icon: '🔥',
                    status: 'active',
                    description: 'Live demo of transcendent module integration - QR Whisper, Mandala, Serpent, Compression.',
                    hubPath: 'grok-integration-demo.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'help',
                    label: 'Help',
                    icon: '❓',
                    status: 'active',
                    description: 'Portal guide and oracle',
                    hubPath: 'apps/help/index.html',
                    launchType: 'html',
                    isLocal: true
                }
            ]
        },
        {
            id: 'media-capture',
            title: '🎬 Media & Capture',
            items: [
                {
                    id: 'codex-media-player',
                    label: 'CODEX Media Player',
                    icon: '🎬',
                    status: 'active',
                    description: 'Universal multimedia interface - documents, images, audio, video (VLC-style viewer)',
                    hubPath: 'codex-media-player.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'codex-capture',
                    label: 'Codex Capture',
                    icon: '📸',
                    status: 'active',
                    description: 'Capture and archive tool for the CODEX system.',
                    hubPath: 'apps/codex_capture/index.html',
                    launchType: 'html',
                    isLocal: true,
                    command: 'python capture.py'
                }
            ]
        },
        {
            id: 'wellness-games',
            title: '🎮 Wellness & Games',
            items: [
                {
                    id: 'pranayama',
                    label: 'Pranayama',
                    icon: '🫁',
                    status: 'active',
                    description: 'Breathwork practice guide and timer for conscious breathing exercises',
                    hubPath: 'apps/pranayama/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'mandala',
                    label: 'Mandala',
                    icon: '🌀',
                    status: 'active',
                    description: 'Deterministic sacred geometry generator',
                    hubPath: 'apps/mandala/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'royal-game-ur',
                    label: 'Royal Game of Ur',
                    icon: '🎲',
                    status: 'active',
                    description: 'Ancient Mesopotamian board game reimagined for digital play',
                    hubPath: 'apps/royal_game_of_ur/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'word-salad',
                    label: 'Word Salad 5.0',
                    icon: '🥗',
                    status: 'active',
                    description: 'Creative word generation and manipulation tool.',
                    hubPath: 'apps/word_salad/Word Salad 5.0/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'samson-recursive',
                    label: "Samson's Infinite Life Proof",
                    icon: '🦁',
                    status: 'active',
                    description: 'Interactive mathematical proof that you are eternal - for the young lion.',
                    hubPath: 'apps/samson_recursive/index.html',
                    launchType: 'html',
                    isLocal: true
                }
            ]
        },
        {
            id: 'specialty-tools',
            title: '🔧 Specialty Tools',
            items: [
                {
                    id: 'bureaucratic-universe',
                    label: 'Bureaucratic Universe',
                    icon: '📋',
                    status: 'active',
                    description: 'Infinite forms system for notices and legal documents.',
                    hubPath: 'apps/bureaucratic_universe/index.html',
                    launchType: 'html',
                    isLocal: true
                },
                {
                    id: 'conflict-lab',
                    label: 'Conflict Lab',
                    icon: '⚡',
                    status: 'active',
                    description: 'Interactive laboratory for exploring and resolving conflicts through structured analysis',
                    hubPath: 'apps/conflict_lab/index.html',
                    launchType: 'html',
                    isLocal: true
                }
            ]
        },
        {
            id: 'toolbox-cli',
            title: '🧰 Toolbox CLI',
            items: [
                {
                    id: 'toolbox',
                    label: 'Toolbox',
                    icon: '🧰',
                    status: 'active',
                    description: 'Main toolbox command - lists all available tools.',
                    hubPath: '10-repos-central/toolbox-cli/bin/toolbox',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/toolbox',
                    launchType: 'cli',
                    command: 'toolbox'
                },
                {
                    id: 'triage',
                    label: 'Triage',
                    icon: '🏥',
                    status: 'active',
                    description: 'File triage and organization system (35KB of pure power).',
                    hubPath: '10-repos-central/toolbox-cli/src/toolbox/triage.py',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/src/toolbox/triage.py',
                    launchType: 'cli',
                    command: 'triage'
                },
                {
                    id: 'doctor',
                    label: 'Doctor',
                    icon: '🩺',
                    status: 'active',
                    description: 'System health diagnostics and repair.',
                    hubPath: '10-repos-central/toolbox-cli/bin/doctor',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/doctor',
                    launchType: 'cli',
                    command: 'doctor'
                },
                {
                    id: 'snapshot',
                    label: 'Snapshot',
                    icon: '📷',
                    status: 'active',
                    description: 'Create system/project snapshots for backup.',
                    hubPath: '10-repos-central/toolbox-cli/bin/snapshot',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/snapshot',
                    launchType: 'cli',
                    command: 'snapshot'
                },
                {
                    id: 'scaffold',
                    label: 'Scaffold',
                    icon: '🏗️',
                    status: 'active',
                    description: 'Project scaffolding and template generator.',
                    hubPath: '10-repos-central/toolbox-cli/bin/scaffold',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/scaffold',
                    launchType: 'cli',
                    command: 'scaffold'
                },
                {
                    id: 'prana',
                    label: 'Prana',
                    icon: '🌬️',
                    status: 'active',
                    description: 'Pranayama breathing exercise CLI.',
                    hubPath: '10-repos-central/toolbox-cli/bin/prana',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/prana',
                    launchType: 'cli',
                    command: 'prana'
                },
                {
                    id: 'focus',
                    label: 'Focus',
                    icon: '🎯',
                    status: 'active',
                    description: 'Focus mode manager for deep work sessions.',
                    hubPath: '10-repos-central/toolbox-cli/bin/focus',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/focus',
                    launchType: 'cli',
                    command: 'focus'
                },
                {
                    id: 'git-wip',
                    label: 'Git WIP',
                    icon: '🚧',
                    status: 'active',
                    description: 'Quick work-in-progress commits.',
                    hubPath: '10-repos-central/toolbox-cli/bin/git-wip',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/git-wip',
                    launchType: 'cli',
                    command: 'git-wip'
                },
                {
                    id: 'git-clean-branches',
                    label: 'Git Clean Branches',
                    icon: '🌿',
                    status: 'active',
                    description: 'Clean up merged/stale git branches.',
                    hubPath: '10-repos-central/toolbox-cli/bin/git-clean-branches',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/git-clean-branches',
                    launchType: 'cli',
                    command: 'git-clean-branches'
                },
                {
                    id: 'logs-tail',
                    label: 'Logs Tail',
                    icon: '📜',
                    status: 'active',
                    description: 'Tail system logs with filtering.',
                    hubPath: '10-repos-central/toolbox-cli/bin/logs-tail',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/logs-tail',
                    launchType: 'cli',
                    command: 'logs-tail'
                },
                {
                    id: 'proj-open',
                    label: 'Project Open',
                    icon: '📂',
                    status: 'active',
                    description: 'Quick project opener in your editor.',
                    hubPath: '10-repos-central/toolbox-cli/bin/proj-open',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/proj-open',
                    launchType: 'cli',
                    command: 'proj-open'
                }
            ]
        },
        {
            id: 'macos-utilities',
            title: '🍎 macOS Utilities',
            items: [
                {
                    id: 'icloud-kick',
                    label: 'iCloud Kick',
                    icon: '☁️',
                    status: 'active',
                    description: 'Force iCloud sync when it gets stuck.',
                    hubPath: '10-repos-central/toolbox-cli/bin/icloud-kick',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/icloud-kick',
                    launchType: 'cli',
                    command: 'icloud-kick',
                    macOnly: true
                },
                {
                    id: 'icloud-kick-super',
                    label: 'iCloud Kick Super',
                    icon: '⚡',
                    status: 'active',
                    description: 'Nuclear option for stuck iCloud sync.',
                    hubPath: '10-repos-central/toolbox-cli/bin/icloud-kick-super',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/icloud-kick-super',
                    launchType: 'cli',
                    command: 'icloud-kick-super',
                    macOnly: true
                },
                {
                    id: 'icloud-diagnostics',
                    label: 'iCloud Diagnostics',
                    icon: '🔍',
                    status: 'active',
                    description: 'Diagnose iCloud sync issues.',
                    hubPath: '10-repos-central/toolbox-cli/bin/icloud-diagnostics',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/icloud-diagnostics',
                    launchType: 'cli',
                    command: 'icloud-diagnostics',
                    macOnly: true
                },
                {
                    id: 'dns-flush',
                    label: 'DNS Flush',
                    icon: '🌐',
                    status: 'active',
                    description: 'Flush DNS cache.',
                    hubPath: '10-repos-central/toolbox-cli/bin/dns-flush',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/dns-flush',
                    launchType: 'cli',
                    command: 'dns-flush'
                },
                {
                    id: 'finder-reload',
                    label: 'Finder Reload',
                    icon: '🔄',
                    status: 'active',
                    description: 'Restart Finder when it gets wonky.',
                    hubPath: '10-repos-central/toolbox-cli/bin/finder-reload',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/finder-reload',
                    launchType: 'cli',
                    command: 'finder-reload',
                    macOnly: true
                },
                {
                    id: 'wifi-cycle',
                    label: 'WiFi Cycle',
                    icon: '📶',
                    status: 'active',
                    description: 'Toggle WiFi off and on.',
                    hubPath: '10-repos-central/toolbox-cli/bin/wifi-cycle',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/bin/wifi-cycle',
                    launchType: 'cli',
                    command: 'wifi-cycle'
                }
            ]
        },
        {
            id: 'hineni-system',
            title: '🧭 HINENI System',
            items: [
                {
                    id: 'hineni-cli',
                    label: 'HINENI CLI',
                    icon: '🧭',
                    status: 'transcendent',
                    description: 'Main HINENI orchestrator - witness protocol, oracle, gematria.',
                    hubPath: '10-repos-central/hineni/hineni_cli.py',
                    winPath: '10-repos/HINENI/hineni_cli.py',
                    launchType: 'cli',
                    command: 'python3 hineni_cli.py'
                },
                {
                    id: 'verify-witness',
                    label: 'Verify Witness',
                    icon: '✅',
                    status: 'active',
                    description: 'Verify witness log integrity.',
                    hubPath: '10-repos-central/hineni/verify_witness.py',
                    winPath: '10-repos/HINENI/verify_witness.py',
                    launchType: 'cli',
                    command: 'python3 verify_witness.py'
                },
                {
                    id: 'oracle',
                    label: 'Oracle Module',
                    icon: '🔮',
                    status: 'active',
                    description: 'Bible oracle and divination system.',
                    hubPath: '10-repos-central/hineni/oracle/',
                    winPath: '10-repos/HINENI/oracle/',
                    launchType: 'folder'
                },
                {
                    id: 'gematria',
                    label: 'Gematria',
                    icon: '🔢',
                    status: 'active',
                    description: 'Hebrew gematria calculation module.',
                    hubPath: '10-repos-central/hineni/davar_lang/gematria.py',
                    winPath: '10-repos/HINENI/davar_lang/gematria.py',
                    launchType: 'file'
                },
                {
                    id: 'lich-module',
                    label: 'Good Lich',
                    icon: '💀',
                    status: 'active',
                    description: 'The Good Lich infrastructure module.',
                    hubPath: '10-repos-central/hineni/infra/lich.py',
                    winPath: '10-repos/HINENI/infra/lich.py',
                    launchType: 'file'
                },
                {
                    id: 'noticing-module',
                    label: 'Noticing',
                    icon: '👁️',
                    status: 'active',
                    description: 'Department of Infinite Noticing module.',
                    hubPath: '10-repos-central/hineni/infra/noticing.py',
                    winPath: '10-repos/HINENI/infra/noticing.py',
                    launchType: 'file'
                }
            ]
        },
        {
            id: 'repos',
            title: '📚 Repositories',
            items: [
                {
                    id: 'codex-monad',
                    label: 'CODEX-MONAD Portal',
                    icon: '🌀',
                    status: 'transcendent',
                    description: 'This portal - the DIN interface.',
                    hubPath: '10-repos-central/CODEX-MONAD',
                    winPath: WIN_GITHUB_BASE + '/CODEX-MONAD',
                    launchType: 'folder'
                },
                {
                    id: 'codex-repo',
                    label: 'CODEX Repo',
                    icon: '📖',
                    status: 'active',
                    description: 'Primary CODEX git repository.',
                    hubPath: '10-repos-central/CODEX',
                    winPath: '10-repos/CODEX_NEWEST',
                    launchType: 'folder'
                },
                {
                    id: 'toolbox-repo',
                    label: 'Toolbox CLI Repo',
                    icon: '🧰',
                    status: 'active',
                    description: 'Full toolbox-cli repository with docs.',
                    hubPath: '10-repos-central/toolbox-cli',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli',
                    launchType: 'folder'
                },
                {
                    id: 'hineni-repo',
                    label: 'HINENI Repo',
                    icon: '🧭',
                    status: 'active',
                    description: 'Full HINENI system repository.',
                    hubPath: '10-repos-central/hineni',
                    winPath: '10-repos/HINENI',
                    launchType: 'folder'
                }
            ]
        },
        {
            id: 'docs',
            title: '📋 Documentation',
            items: [
                {
                    id: 'toolbox-cheatsheet',
                    label: 'Toolbox Cheatsheet',
                    icon: '📋',
                    status: 'active',
                    description: 'Quick reference for all toolbox commands.',
                    hubPath: '10-repos-central/toolbox-cli/docs/TOOLBOX_CHEATSHEET.md',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/docs/TOOLBOX_CHEATSHEET.md',
                    launchType: 'file'
                },
                {
                    id: 'toolbox-reference',
                    label: 'Toolbox Reference',
                    icon: '📚',
                    status: 'active',
                    description: 'Full toolbox documentation.',
                    hubPath: '10-repos-central/toolbox-cli/docs/TOOLBOX_REFERENCE.md',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/docs/TOOLBOX_REFERENCE.md',
                    launchType: 'file'
                },
                {
                    id: 'morning-ops',
                    label: 'Morning Ops',
                    icon: '☀️',
                    status: 'active',
                    description: 'Morning operations checklist.',
                    hubPath: '10-repos-central/toolbox-cli/docs/MORNING_OPS.txt',
                    winPath: WIN_GITHUB_BASE + '/toolbox-cli/docs/MORNING_OPS.txt',
                    launchType: 'file'
                },
                {
                    id: 'witness-protocol',
                    label: 'Witness Protocol',
                    icon: '📜',
                    status: 'active',
                    description: 'The HINENI Witness Protocol specification.',
                    hubPath: '10-repos-central/hineni/docs/WITNESS_PROTOCOL.md',
                    winPath: '10-repos/HINENI/docs/WITNESS_PROTOCOL.md',
                    launchType: 'file'
                },
                {
                    id: 'davar-spec',
                    label: 'Davar Spec',
                    icon: '✡️',
                    status: 'active',
                    description: 'The Davar language specification.',
                    hubPath: '10-repos-central/hineni/docs/DAVAR_SPEC.md',
                    winPath: '10-repos/HINENI/docs/DAVAR_SPEC.md',
                    launchType: 'file'
                },
                {
                    id: 'vision-doc',
                    label: 'Vision Document',
                    icon: '🔭',
                    status: 'active',
                    description: 'The HINENI vision and roadmap.',
                    hubPath: '10-repos-central/hineni/docs/VISION.md',
                    winPath: '10-repos/HINENI/docs/VISION.md',
                    launchType: 'file'
                }
            ]
        },
        {
            id: 'archives',
            title: '🗄️ Archives & Packs',
            items: [
                {
                    id: 'codex-packs',
                    label: 'Codex Packs Archive',
                    icon: '📦',
                    status: 'active',
                    description: 'All archived codex packs (.zip bundles).',
                    hubPath: '40-archive/codex-packs',
                    winPath: '20-archive',
                    launchType: 'folder'
                }
            ]
        }
    ];

    /**
     * Build the href for an item based on its type and platform
     */
    function buildHref(item) {
        if (!item.hubPath) return null;

        // HTML apps that are LOCAL to CODEX-MONAD use direct relative paths
        // These work on ALL platforms
        if (item.launchType === 'html' && item.isLocal) {
            return item.hubPath;
        }

        // Non-local items require the hub to be available
        if (!HUB_AVAILABLE) {
            return null; // Will show as unavailable
        }

        // Get the appropriate path for the current platform
        var itemPath = item.hubPath;
        if (IS_WINDOWS && item.winPath) {
            itemPath = item.winPath;
        } else if (IS_WINDOWS && !item.winPath) {
            return null; // Windows path not available
        }

        // HTML apps elsewhere in the hub use relative from portal
        if (item.launchType === 'html') {
            return RELATIVE_ROOT + '/' + itemPath;
        }

        // Everything else (folders, files, CLI) uses file:// for Finder/Explorer
        return 'file://' + HUB_ROOT + '/' + itemPath;
    }

    /**
     * Check if an item is available on the current platform
     */
    function isItemAvailable(item) {
        // Local HTML apps always available
        if (item.launchType === 'html' && item.isLocal) {
            return true;
        }
        // macOS-only items not available on Windows
        if (IS_WINDOWS && item.macOnly) {
            return false;
        }
        // Windows needs winPath defined
        if (IS_WINDOWS && !item.winPath) {
            return false;
        }
        // Everything else requires hub
        return HUB_AVAILABLE;
    }

    /**
     * Create a single card element
     */
    function createCard(item) {
        var card = document.createElement('div');
        card.className = 'portal-card hub-card';
        card.dataset.hubId = item.id;
        card.dataset.launchType = item.launchType || 'folder';

        var available = isItemAvailable(item);
        var href = buildHref(item);

        // Add unavailable class for styling
        if (!available) {
            card.className += ' hub-unavailable';
        }

        var statusClass = (item.status || '').toLowerCase() === 'transcendent'
            ? 'status transcendent'
            : 'status active';

        var statusHtml = item.status
            ? '<span class="' + statusClass + '">' + item.status.toUpperCase() + '</span>'
            : '';

        // Different button text and styling based on launch type
        var buttonIcon = '📂';
        var buttonText = 'Open';
        var buttonClass = 'app-link hub-link';

        switch(item.launchType) {
            case 'html':
                buttonIcon = '🚀';
                buttonText = 'Launch';
                buttonClass = 'app-link';  // Blue for launchable
                break;
            case 'cli':
                buttonIcon = '💻';
                buttonText = 'Folder';
                break;
            case 'file':
                buttonIcon = '📄';
                buttonText = 'View';
                break;
            case 'folder':
            default:
                buttonIcon = '📂';
                buttonText = 'Open';
        }

        // Build link HTML
        var linkHtml = '';
        if (href && available) {
            if (item.launchType === 'html') {
                // HTML apps open in browser
                linkHtml = '<a href="' + href + '" class="' + buttonClass + '">' + buttonIcon + ' ' + buttonText + '</a>';
            } else {
                // Everything else shows path and opens in Finder/Explorer
                var openIn = IS_MACOS ? 'Finder' : 'Explorer';
                linkHtml = '<a href="' + href + '" class="' + buttonClass + '" title="Open in ' + openIn + '">' + buttonIcon + ' ' + buttonText + '</a>';
            }
        } else if (!available) {
            // Show unavailable state with reason
            var reason = item.macOnly ? 'macOS only' : 'Not on this drive';
            linkHtml = '<span class="app-link hub-link unavailable" title="' + reason + '">🔒 ' + reason + '</span>';
        }

        // Add command hint for CLI tools
        if (item.command) {
            linkHtml += '<code class="cli-hint">$ ' + item.command + '</code>';
        }

        card.innerHTML =
            '<div class="card-header">' +
                '<span class="card-icon">' + (item.icon || '📦') + '</span>' +
                '<h2 class="card-title">' + item.label + '</h2>' +
                statusHtml +
            '</div>' +
            '<div class="card-description">' +
                (item.description || '') +
            '</div>' +
            '<div class="card-links">' +
                linkHtml +
            '</div>';

        return card;
    }

    /**
     * Create a category section with its grid
     */
    function createCategorySection(category) {
        var section = document.createElement('div');
        section.className = 'hub-category';
        section.dataset.categoryId = category.id;

        var title = document.createElement('h3');
        title.className = 'hub-category-title';
        title.textContent = category.title;
        section.appendChild(title);

        var grid = document.createElement('div');
        grid.className = 'portal-grid';

        category.items.forEach(function(item) {
            grid.appendChild(createCard(item));
        });

        section.appendChild(grid);
        return section;
    }

    /**
     * Main render function
     */
    async function renderHubSection() {
        var container = document.getElementById('hineni-hub-section');
        if (!container) {
            console.warn('HINENI HUB: #hineni-hub-section not found, skipping render');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Create the hub section wrapper
        var hubSection = document.createElement('div');
        hubSection.className = 'hub-section';

        // Header with stats
        var header = document.createElement('div');
        header.className = 'hub-section-header';
        var mountPoint = IS_MACOS ? '/Volumes/HINENI_HUB' : (IS_WINDOWS ? 'E:\\ (HINENI_HUB_PC)' : 'Not available');
        header.innerHTML =
            '<h2 class="hub-section-title">HINENI HUB</h2>' +
            '<div class="hub-section-subtitle">Portable Infrastructure • ' + mountPoint + '</div>' +
            '<div class="hub-stats">' + getTotalItemCount() + ' tools • ' + HUB_CATEGORIES.length + ' categories</div>';
        hubSection.appendChild(header);


        // Load and render CODEX-MONAD apps
        var codexApps = await loadCodexApps();
        if (codexApps.length > 0) {
            var codexCategory = {
                id: 'codex-apps',
                title: '💎 CODEX-MONAD Apps',
                items: codexApps
            };
            hubSection.appendChild(createCategorySection(codexCategory));
        }

        // Render each category
        HUB_CATEGORIES.forEach(function(category) {
            hubSection.appendChild(createCategorySection(category));
        });

        // Insert into container
        container.appendChild(hubSection);

        console.log('🧭 HINENI HUB v2.5: Rendered ' + getTotalItemCount() + ' items in ' + HUB_CATEGORIES.length + ' categories (' + PLATFORM + ')');
    }

    /**
     * Count total items
     */
    function getTotalItemCount() {
        return HUB_CATEGORIES.reduce(function(sum, cat) {
            return sum + cat.items.length;
        }, 0);
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderHubSection);
    } else {
        renderHubSection();
    }

    // Expose for debugging
    window.HINENI_HUB = {
        categories: HUB_CATEGORIES,
        root: HUB_ROOT,
        relativeRoot: RELATIVE_ROOT,
        platform: PLATFORM,
        hubAvailable: HUB_AVAILABLE,
        refresh: renderHubSection,
        version: '2.6'
    };

})();
