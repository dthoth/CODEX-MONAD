/**
 * HINENI HUB - Portal Integration
 * Renders the hub inventory as categorized cards inside the DIN Portal
 * 
 * Mount point: /Volumes/HINENI_HUB
 * This script injects into #hineni-hub-section
 */
(function() {
    'use strict';

    var HUB_ROOT = '/Volumes/HINENI_HUB';

    // Hub items organized by category
    var HUB_CATEGORIES = [
        {
            id: 'tools',
            title: '🛠️ Tools & CLIs',
            items: [
                {
                    id: 'hineni',
                    label: 'HINENI Orchestrator',
                    icon: '🧭',
                    status: 'active',
                    description: 'Orchestrates sync and hub operations from the command line.',
                    hubPath: '10-repos-central/hineni'
                },
                {
                    id: 'toolbox-cli',
                    label: 'Toolbox CLI',
                    icon: '🧰',
                    status: 'active',
                    description: 'CLI toolbox for quick maintenance and scripting helpers.',
                    hubPath: '10-repos-central/toolbox-cli'
                },
                {
                    id: 'conflict-lab',
                    label: 'Conflict Lab',
                    icon: '⚖️',
                    status: 'active',
                    description: 'Interactive conflict/game environment living in the hub.',
                    hubPath: '10-repos-central/conflict-lab'
                }
            ]
        },
        {
            id: 'repos',
            title: '📂 Repositories',
            items: [
                {
                    id: 'codex-live',
                    label: 'Codex (Live Tree)',
                    icon: '📚',
                    status: 'active',
                    description: 'Live Codex directory mirrored under 30-codex-extras.',
                    hubPath: '30-codex-extras/mac-home/Codex'
                },
                {
                    id: 'codex-repo',
                    label: 'CODEX Repo',
                    icon: '📖',
                    status: 'active',
                    description: 'Primary CODEX git repository in the hub.',
                    hubPath: '10-repos-central/CODEX'
                },
                {
                    id: 'codex-monad',
                    label: 'CODEX-MONAD Portal',
                    icon: '🌀',
                    status: 'transcendent',
                    description: 'Monad portal web UI (this site).',
                    hubPath: '10-repos-central/CODEX-MONAD'
                }
            ]
        },
        {
            id: 'packs',
            title: '📦 Codex Packs',
            items: [
                {
                    id: 'codex-0',
                    label: 'Codex 0',
                    icon: '📦',
                    status: 'active',
                    description: 'Base Codex pack.',
                    hubPath: '40-archive/codex-packs/codex-0.zip'
                },
                {
                    id: 'codex-0-redux',
                    label: 'Codex 0 Redux',
                    icon: '📦',
                    status: 'active',
                    description: 'Redux version of Codex 0.',
                    hubPath: '40-archive/codex-packs/codex-0-redux.zip'
                },
                {
                    id: 'codex-0-redux-jun5',
                    label: 'Codex 0 Redux (Jun 5)',
                    icon: '📦',
                    status: 'active',
                    description: 'Jun 5 2025 snapshot of Codex 0 Redux.',
                    hubPath: '40-archive/codex-packs/codex-0-redux-jun5.zip'
                },
                {
                    id: 'lc-vol-0',
                    label: 'LC Vol 0',
                    icon: '📦',
                    status: 'active',
                    description: 'LC-Vol-0 Codex pack.',
                    hubPath: '40-archive/codex-packs/lc-vol-0.zip'
                },
                {
                    id: 'polywrite3pro',
                    label: 'Polywrite3Pro',
                    icon: '✍️',
                    status: 'active',
                    description: 'Polywrite3Pro Codex bundle.',
                    hubPath: '40-archive/codex-packs/polywrite3pro.zip'
                },
                {
                    id: 'psychometrics',
                    label: 'Psychometrics',
                    icon: '🧠',
                    status: 'active',
                    description: 'Psychometrics game/pack.',
                    hubPath: '40-archive/codex-packs/psychometrics.zip'
                },
                {
                    id: 'shell-terminal-scripts',
                    label: 'Shell Terminal Scripts',
                    icon: '💻',
                    status: 'active',
                    description: 'Shell helper scripts bundle.',
                    hubPath: '40-archive/codex-packs/shell-terminal-scripts.zip'
                }
            ]
        },
        {
            id: 'archives',
            title: '🗄️ Archives & Vaults',
            items: [
                {
                    id: 'codex-scripts-notes-2025-06-09',
                    label: 'Codex Scripts & Notes (2025-06-09)',
                    icon: '📜',
                    status: 'active',
                    description: 'Codex scripts and notes bundle (June 9 2025).',
                    hubPath: '40-archive/codex-packs/codex-scripts-notes-2025-06-09.zip'
                },
                {
                    id: 'codex-staging-june6',
                    label: 'Codex Staging (June 6)',
                    icon: '📜',
                    status: 'active',
                    description: 'Codex staging bundle from June 6.',
                    hubPath: '40-archive/codex-packs/codex-staging-june6.zip'
                },
                {
                    id: 'home-planning',
                    label: 'Home Planning',
                    icon: '🏠',
                    status: 'active',
                    description: 'Home planning Codex pack.',
                    hubPath: '40-archive/codex-packs/home-planning.zip'
                },
                {
                    id: 'phone-vault',
                    label: 'Phone Vault',
                    icon: '📱',
                    status: 'active',
                    description: 'Phone vault Codex pack.',
                    hubPath: '40-archive/codex-packs/phone-vault.zip'
                },
                {
                    id: 'local-vault-x',
                    label: 'Local Vault X',
                    icon: '🗄️',
                    status: 'active',
                    description: 'LOCAL_VAULT_X Codex pack.',
                    hubPath: '40-archive/codex-packs/local-vault-x.zip'
                },
                {
                    id: 'lux-luther',
                    label: 'Lux Luther',
                    icon: '🃏',
                    status: 'active',
                    description: 'Lux Luther pack.',
                    hubPath: '40-archive/codex-packs/lux-luther.zip'
                },
                {
                    id: 'codex-archive',
                    label: 'Codex Archive',
                    icon: '🗃️',
                    status: 'active',
                    description: 'Codex archive bundle.',
                    hubPath: '40-archive/codex-packs/codex-archive.zip'
                },
                {
                    id: 'filecabinet-obs-2024',
                    label: 'FILECABINET OBS 2024',
                    icon: '🗂️',
                    status: 'active',
                    description: 'Filecabinet observations 2024 archive.',
                    hubPath: '40-archive/codex-packs/filecabinet-obs-2024.zip'
                }
            ]
        },
        {
            id: 'ai',
            title: '🤖 AI Infrastructure',
            items: [
                {
                    id: 'ai-datasets-origin',
                    label: 'AI Datasets (Origin)',
                    icon: '🧬',
                    status: 'active',
                    description: 'Source datasets for AI experiments.',
                    hubPath: '50-ai/datasets-origin'
                },
                {
                    id: 'ai-models-origin',
                    label: 'AI Models (Origin)',
                    icon: '🧠',
                    status: 'active',
                    description: 'Source models / checkpoints for AI experiments.',
                    hubPath: '50-ai/models-origin'
                }
            ]
        },
        {
            id: 'meta',
            title: '⚙️ Meta & Config',
            items: [
                {
                    id: 'og-scrape-config',
                    label: 'Origin Scrape Config',
                    icon: '📜',
                    status: 'active',
                    description: 'Configuration for the original OG scrape.',
                    hubPath: 'data_sources/og_scrape'
                },
                {
                    id: 'og-scrape-mine',
                    label: 'OG Scrape (Mine)',
                    icon: '⛏️',
                    status: 'active',
                    description: 'Derived indices and mappings from the OG scrape.',
                    hubPath: '30-codex-extras/og_scrape_mine'
                }
            ]
        }
    ];

    /**
     * Create a single card element
     */
    function createCard(item) {
        var card = document.createElement('div');
        card.className = 'portal-card hub-card';
        card.dataset.hubId = item.id;

        var statusClass = (item.status || '').toLowerCase() === 'transcendent'
            ? 'status transcendent'
            : 'status active';

        var hubLink = item.hubPath
            ? 'file://' + HUB_ROOT + '/' + item.hubPath
            : null;

        var statusHtml = item.status
            ? '<span class="' + statusClass + '">' + item.status.toUpperCase() + '</span>'
            : '';

        var pathHtml = item.hubPath
            ? '<br><code>' + item.hubPath + '</code>'
            : '';

        // For file:// links, we show the path but note they work best in Finder
        var linkHtml = hubLink
            ? '<a href="' + hubLink + '" class="app-link hub-link" title="Open in Finder (file:// link)">📂 Open Path</a>'
            : '';

        card.innerHTML = 
            '<div class="card-header">' +
                '<span class="card-icon">' + (item.icon || '📦') + '</span>' +
                '<h2 class="card-title">' + item.label + '</h2>' +
                statusHtml +
            '</div>' +
            '<div class="card-description">' +
                (item.description || '') +
                pathHtml +
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
    function renderHubSection() {
        var container = document.getElementById('hineni-hub-section');
        if (!container) {
            console.warn('HINENI HUB: #hineni-hub-section not found, skipping render');
            return;
        }

        // Create the hub section wrapper
        var hubSection = document.createElement('div');
        hubSection.className = 'hub-section';

        // Header
        var header = document.createElement('div');
        header.className = 'hub-section-header';
        header.innerHTML = 
            '<h2 class="hub-section-title">HINENI HUB</h2>' +
            '<div class="hub-section-subtitle">Portable Infrastructure • /Volumes/HINENI_HUB</div>';
        hubSection.appendChild(header);

        // Render each category
        HUB_CATEGORIES.forEach(function(category) {
            hubSection.appendChild(createCategorySection(category));
        });

        // Insert into container
        container.appendChild(hubSection);

        console.log('🧭 HINENI HUB: Rendered ' + getTotalItemCount() + ' items in ' + HUB_CATEGORIES.length + ' categories');
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
        refresh: renderHubSection
    };

})();
HUB_ITEMS = HUB_ITEMS.concat([
  {
    id: "symbol-key-sprint",
    label: "Symbol Key Sprint (Gridless Hardcore)",
    icon: "🧩",
    status: "active",
    description: "Pack containing Conflict Lab content, Game of Ur, symbolic testing, and reference PDF.",
    hubPath: "30-codex-extras/Symbol_Key_Sprint_GRIDLESS_HARDCORE"
  },
  {
    id: "symbol-key-sprint-pdf",
    label: "Symbol Key Sprint PDF",
    icon: "📄",
    status: "active",
    description: "PDF rules / reference for the Symbol Key Sprint GRIDLESS HARDCORE run.",
    hubPath: "30-codex-extras/Symbol_Key_Sprint_GRIDLESS_HARDCORE/Symbol_Key_Sprint_GRIDLESS_HARDCORE.pdf"
  },
  {
    id: "temple-nickel-reserve",
    label: "Temple Nickel Reserve v3.0.0",
    icon: "🏛️",
    status: "active",
    description: "Temple Nickel Reserve module/archive (v3.0.0) from the Windows run.",
    hubPath: "30-codex-extras/Symbol_Key_Sprint_GRIDLESS_HARDCORE/temple-nickel-reserve-v3.0.0.zip"
  },
  {
    id: "game-of-ur",
    label: "Game of Ur",
    icon: "🎲",
    status: "active",
    description: "Game of Ur adaptation / assets for symbolic play.",
    hubPath: "30-codex-extras/Symbol_Key_Sprint_GRIDLESS_HARDCORE/Game of Ur"
  },
  {
    id: "symbolic-testing",
    label: "Symbolic Testing",
    icon: "🧪",
    status: "active",
    description: "Symbolic testing sandbox for the gridless sprint.",
    hubPath: "30-codex-extras/Symbol_Key_Sprint_GRIDLESS_HARDCORE/Symbolic Testing"
  }
]);
