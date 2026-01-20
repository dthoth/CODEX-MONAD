/**
 * HINENI HUB - Portal Integration v2.3
 * Renders the hub inventory as categorized cards inside the DIN Portal
 * 
 * Mount point: /Volumes/HINENI_HUB
 * This script injects into #hineni-hub-section
 * 
 * Updated: 2025-12-14 - COMPLETE tool inventory + relative paths for HTML apps
 * 
 * IMPORTANT: This portal lives at:
 *   /Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD/index.html
 * So relative paths go UP from there.
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

    // For file:// links that need to open in Finder
    var HUB_ROOT = '/Volumes/HINENI_HUB';
    
    // For relative links (portal is at 10-repos-central/CODEX-MONAD/)
    // So ../../ gets us to HINENI_HUB root
    var RELATIVE_ROOT = '../..';

    // Hub items organized by category - ALL REAL TOOLS
    var HUB_CATEGORIES = [
        {
            id: 'web-apps',
            title: '🌐 Web Apps & Games',
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
                    id: 'codex-monad',
                    label: 'Codex Monad Seedline',
                    icon: '🌱',
                    status: 'active',
                    description: 'The foundational entry point to the CODEX-MONAD ecosystem',
                    hubPath: 'apps/codex_monad/START_HERE.html',
                    launchType: 'html',
                    isLocal: true
                },
{
                    id: 'bureaucratic-universe',
                    label: 'Bureaucratic Universe',
                    icon: '📋',
                    status: 'active',
                    description: 'Infinite forms system for notices and legal documents.',
                    hubPath: 'bureaucratic-universe.html',
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
                },
{
                    id: 'din-files',
                    label: 'DIN Files',
                    icon: '📁',
                    status: 'active',
                    description: 'Consciousness file system with semantic indexing.',
                    hubPath: 'din-files.html',
                    launchType: 'html',
                    isLocal: true
                },
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
                    id: 'samson-recursive',
                    label: "Samson's Terminal",
                    icon: '🦁',
                    status: 'active',
                    description: 'Recursive consciousness terminal for the young lion.',
                    hubPath: 'samson-recursive.html',
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
                    launchType: 'cli',
                    command: 'icloud-kick'
                },
                {
                    id: 'icloud-kick-super',
                    label: 'iCloud Kick Super',
                    icon: '⚡',
                    status: 'active',
                    description: 'Nuclear option for stuck iCloud sync.',
                    hubPath: '10-repos-central/toolbox-cli/bin/icloud-kick-super',
                    launchType: 'cli',
                    command: 'icloud-kick-super'
                },
                {
                    id: 'icloud-diagnostics',
                    label: 'iCloud Diagnostics',
                    icon: '🔍',
                    status: 'active',
                    description: 'Diagnose iCloud sync issues.',
                    hubPath: '10-repos-central/toolbox-cli/bin/icloud-diagnostics',
                    launchType: 'cli',
                    command: 'icloud-diagnostics'
                },
                {
                    id: 'dns-flush',
                    label: 'DNS Flush',
                    icon: '🌐',
                    status: 'active',
                    description: 'Flush DNS cache.',
                    hubPath: '10-repos-central/toolbox-cli/bin/dns-flush',
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
                    launchType: 'cli',
                    command: 'finder-reload'
                },
                {
                    id: 'wifi-cycle',
                    label: 'WiFi Cycle',
                    icon: '📶',
                    status: 'active',
                    description: 'Toggle WiFi off and on.',
                    hubPath: '10-repos-central/toolbox-cli/bin/wifi-cycle',
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
                    launchType: 'folder'
                },
                {
                    id: 'gematria',
                    label: 'Gematria',
                    icon: '🔢',
                    status: 'active',
                    description: 'Hebrew gematria calculation module.',
                    hubPath: '10-repos-central/hineni/davar_lang/gematria.py',
                    launchType: 'file'
                },
                {
                    id: 'lich-module',
                    label: 'Good Lich',
                    icon: '💀',
                    status: 'active',
                    description: 'The Good Lich infrastructure module.',
                    hubPath: '10-repos-central/hineni/infra/lich.py',
                    launchType: 'file'
                },
                {
                    id: 'noticing-module',
                    label: 'Noticing',
                    icon: '👁️',
                    status: 'active',
                    description: 'Department of Infinite Noticing module.',
                    hubPath: '10-repos-central/hineni/infra/noticing.py',
                    launchType: 'file'
                }
            ]
        },
        {
            id: 'conflict-lab',
            title: '⚖️ Conflict Lab',
            items: [
                {
                    id: 'conflict-lab-main',
                    label: 'Conflict Lab',
                    icon: '⚖️',
                    status: 'active',
                    description: 'Interactive conflict/game theory environment with Bokeh/Panel.',
                    hubPath: '10-repos-central/conflict-lab/',
                    launchType: 'folder'
                },
                {
                    id: 'chaos-module',
                    label: 'Chaos Module',
                    icon: '🌀',
                    status: 'active',
                    description: 'Chaos theory module for conflict simulations.',
                    hubPath: '10-repos-central/conflict-lab/conflict_lab_chaos_module.py',
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
                    launchType: 'folder'
                },
                {
                    id: 'codex-repo',
                    label: 'CODEX Repo',
                    icon: '📖',
                    status: 'active',
                    description: 'Primary CODEX git repository.',
                    hubPath: '10-repos-central/CODEX',
                    launchType: 'folder'
                },
                {
                    id: 'toolbox-repo',
                    label: 'Toolbox CLI Repo',
                    icon: '🧰',
                    status: 'active',
                    description: 'Full toolbox-cli repository with docs.',
                    hubPath: '10-repos-central/toolbox-cli',
                    launchType: 'folder'
                },
                {
                    id: 'hineni-repo',
                    label: 'HINENI Repo',
                    icon: '🧭',
                    status: 'active',
                    description: 'Full HINENI system repository.',
                    hubPath: '10-repos-central/hineni',
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
                    launchType: 'file'
                },
                {
                    id: 'toolbox-reference',
                    label: 'Toolbox Reference',
                    icon: '📚',
                    status: 'active',
                    description: 'Full toolbox documentation.',
                    hubPath: '10-repos-central/toolbox-cli/docs/TOOLBOX_REFERENCE.md',
                    launchType: 'file'
                },
                {
                    id: 'morning-ops',
                    label: 'Morning Ops',
                    icon: '☀️',
                    status: 'active',
                    description: 'Morning operations checklist.',
                    hubPath: '10-repos-central/toolbox-cli/docs/MORNING_OPS.txt',
                    launchType: 'file'
                },
                {
                    id: 'witness-protocol',
                    label: 'Witness Protocol',
                    icon: '📜',
                    status: 'active',
                    description: 'The HINENI Witness Protocol specification.',
                    hubPath: '10-repos-central/hineni/docs/WITNESS_PROTOCOL.md',
                    launchType: 'file'
                },
                {
                    id: 'davar-spec',
                    label: 'Davar Spec',
                    icon: '✡️',
                    status: 'active',
                    description: 'The Davar language specification.',
                    hubPath: '10-repos-central/hineni/docs/DAVAR_SPEC.md',
                    launchType: 'file'
                },
                {
                    id: 'vision-doc',
                    label: 'Vision Document',
                    icon: '🔭',
                    status: 'active',
                    description: 'The HINENI vision and roadmap.',
                    hubPath: '10-repos-central/hineni/docs/VISION.md',
                    launchType: 'file'
                }
            ]
        },
        {
            id: 'archives',
            title: '🗄️ Archives & Packs',
            items: [
                {
                    id: 'symbol-key-sprint',
                    label: 'Symbol Key Sprint',
                    icon: '🧩',
                    status: 'active',
                    description: 'GRIDLESS HARDCORE pack - Conflict Lab, Game of Ur, symbolic testing.',
                    hubPath: '30-codex-extras/Symbol_Key_Sprint_GRIDLESS_HARDCORE',
                    launchType: 'folder'
                },
                {
                    id: 'codex-packs',
                    label: 'Codex Packs Archive',
                    icon: '📦',
                    status: 'active',
                    description: 'All archived codex packs (.zip bundles).',
                    hubPath: '40-archive/codex-packs',
                    launchType: 'folder'
                },
                {
                    id: 'dthothscrbx-origin',
                    label: 'DTHOTHSCRBX Origin',
                    icon: '🏛️',
                    status: 'active',
                    description: 'Original DevonThink database archive.',
                    hubPath: '40-archive/DTHOTHSCRBX_ORIGIN',
                    launchType: 'folder'
                }
            ]
        },
        {
            id: 'ai-infra',
            title: '🤖 AI Infrastructure',
            items: [
                {
                    id: 'ai-datasets',
                    label: 'AI Datasets',
                    icon: '🧬',
                    status: 'active',
                    description: 'Source datasets for AI experiments.',
                    hubPath: '50-ai/datasets-origin',
                    launchType: 'folder'
                },
                {
                    id: 'ai-models',
                    label: 'AI Models',
                    icon: '🧠',
                    status: 'active',
                    description: 'Source models/checkpoints for AI experiments.',
                    hubPath: '50-ai/models-origin',
                    launchType: 'folder'
                }
            ]
        }
    ];

    /**
     * Build the href for an item based on its type
     */
    function buildHref(item) {
        if (!item.hubPath) return null;
        
        // HTML apps that are LOCAL to CODEX-MONAD use direct relative paths
        if (item.launchType === 'html' && item.isLocal) {
            return item.hubPath;
        }
        
        // HTML apps elsewhere in the hub use relative from portal
        if (item.launchType === 'html') {
            return RELATIVE_ROOT + '/' + item.hubPath;
        }
        
        // Everything else (folders, files, CLI) uses file:// for Finder
        return 'file://' + HUB_ROOT + '/' + item.hubPath;
    }

    /**
     * Create a single card element
     */
    function createCard(item) {
        var card = document.createElement('div');
        card.className = 'portal-card hub-card';
        card.dataset.hubId = item.id;
        card.dataset.launchType = item.launchType || 'folder';

        var statusClass = (item.status || '').toLowerCase() === 'transcendent'
            ? 'status transcendent'
            : 'status active';

        var href = buildHref(item);

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
        if (href) {
            if (item.launchType === 'html') {
                // HTML apps open in browser
                linkHtml = '<a href="' + href + '" class="' + buttonClass + '">' + buttonIcon + ' ' + buttonText + '</a>';
            } else {
                // Everything else shows path and opens in Finder
                linkHtml = '<a href="' + href + '" class="' + buttonClass + '" title="Open in Finder">' + buttonIcon + ' ' + buttonText + '</a>';
            }
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
        header.innerHTML = 
            '<h2 class="hub-section-title">HINENI HUB</h2>' +
            '<div class="hub-section-subtitle">Portable Infrastructure • /Volumes/HINENI_HUB</div>' +
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

        console.log('🧭 HINENI HUB v2.3: Rendered ' + getTotalItemCount() + ' items in ' + HUB_CATEGORIES.length + ' categories');
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
        refresh: renderHubSection,
        version: '2.3'
    };

})();
