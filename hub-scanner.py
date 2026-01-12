#!/usr/bin/env python3
"""
HINENI HUB Scanner v1.0
=======================
Walks the hub filesystem, discovers tools, generates hub-inventory.json

Usage:
    python3 hub-scanner.py [hub_root] [output_file]
    
Defaults:
    hub_root: /Volumes/HINENI_HUB
    output_file: hub-inventory.json (in hub_root/10-repos-central/CODEX-MONAD/)

The scanner looks for:
1. HINENI.manifest files (self-declaring tools)
2. Known HTML apps (*.html files in expected locations)
3. Known CLI tools (by convention in toolbox-cli/bin/)
4. Documentation (*.md, *.txt in docs/ folders)
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

DEFAULT_HUB_ROOT = "/Volumes/HINENI_HUB"
DEFAULT_OUTPUT = "10-repos-central/CODEX-MONAD/hub-inventory.json"

# Directories to skip
SKIP_DIRS = {
    'node_modules', '.git', '.venv', '__pycache__', 
    '.DS_Store', 'venv', 'env', '.idea', '.vscode'
}

# Known categories for organization
CATEGORIES = {
    'web-apps': {'title': '🌐 Web Apps & Games', 'priority': 1},
    'toolbox-cli': {'title': '🧰 Toolbox CLI', 'priority': 2},
    'macos-utils': {'title': '🍎 macOS Utilities', 'priority': 3},
    'hineni-system': {'title': '🧭 HINENI System', 'priority': 4},
    'conflict-lab': {'title': '⚖️ Conflict Lab', 'priority': 5},
    'repos': {'title': '📚 Repositories', 'priority': 6},
    'docs': {'title': '📋 Documentation', 'priority': 7},
    'archives': {'title': '🗄️ Archives & Packs', 'priority': 8},
    'ai-infra': {'title': '🤖 AI Infrastructure', 'priority': 9},
    'discovered': {'title': '🔍 Discovered', 'priority': 99}
}

# ═══════════════════════════════════════════════════════════════════
# SCANNER CLASS
# ═══════════════════════════════════════════════════════════════════

class HubScanner:
    def __init__(self, hub_root):
        self.hub_root = Path(hub_root)
        self.inventory = {
            'meta': {
                'generated': datetime.now().isoformat(),
                'hub_root': str(self.hub_root),
                'version': '1.0'
            },
            'categories': {},
            'items': [],
            'stats': {
                'manifests_found': 0,
                'html_apps_found': 0,
                'cli_tools_found': 0,
                'docs_found': 0,
                'total_items': 0
            },
            'scan_log': []
        }
        
    def log(self, message, level='info'):
        """Add to scan log for awakening display"""
        entry = {
            'time': datetime.now().isoformat(),
            'level': level,
            'message': message
        }
        self.inventory['scan_log'].append(entry)
        
        # Also print for terminal feedback
        prefix = {'info': '  ', 'success': '✓ ', 'warning': '⚠ ', 'error': '✗ '}
        print(f"{prefix.get(level, '  ')}{message}")
    
    def scan(self):
        """Main scan entry point"""
        print("\n" + "═" * 50)
        print("  HINENI HUB SCANNER v1.0")
        print("═" * 50)
        print(f"\nScanning: {self.hub_root}\n")
        
        start_time = time.time()
        
        # Initialize categories
        for cat_id, cat_info in CATEGORIES.items():
            self.inventory['categories'][cat_id] = {
                'id': cat_id,
                'title': cat_info['title'],
                'priority': cat_info['priority'],
                'items': []
            }
        
        # Scan phases
        self.scan_manifests()
        self.scan_html_apps()
        self.scan_cli_tools()
        self.scan_docs()
        self.scan_known_locations()
        
        # Calculate stats
        self.inventory['stats']['total_items'] = len(self.inventory['items'])
        
        elapsed = time.time() - start_time
        self.inventory['meta']['scan_duration_ms'] = int(elapsed * 1000)
        
        print(f"\n{'═' * 50}")
        print(f"  Scan complete in {elapsed:.2f}s")
        print(f"  Total items: {self.inventory['stats']['total_items']}")
        print("═" * 50 + "\n")
        
        return self.inventory
    
    def scan_manifests(self):
        """Find all HINENI.manifest files"""
        self.log("Scanning for HINENI.manifest files...")
        
        for manifest_path in self.hub_root.rglob("HINENI.manifest"):
            if self._should_skip(manifest_path):
                continue
                
            try:
                with open(manifest_path, 'r') as f:
                    manifest = json.load(f)
                
                if manifest.get('hineni'):
                    item = self._manifest_to_item(manifest, manifest_path)
                    self._add_item(item)
                    self.inventory['stats']['manifests_found'] += 1
                    self.log(f"{manifest_path.parent.name} says HINENI", 'success')
                    
            except (json.JSONDecodeError, IOError) as e:
                self.log(f"Error reading {manifest_path}: {e}", 'warning')
    
    def scan_html_apps(self):
        """Find HTML applications"""
        self.log("Scanning for HTML applications...")
        
        # Look in known app locations
        app_locations = [
            self.hub_root / "10-repos-central" / "CODEX-MONAD",
            self.hub_root / "10-repos-central" / "CODEX-MONAD" / "apps",
            self.hub_root / "30-codex-extras",
        ]
        
        for location in app_locations:
            if not location.exists():
                continue
                
            for html_file in location.rglob("*.html"):
                if self._should_skip(html_file):
                    continue
                if html_file.name.startswith('_'):
                    continue
                if 'template' in html_file.name.lower():
                    continue
                    
                # Check if already added via manifest
                rel_path = str(html_file.relative_to(self.hub_root))
                if any(item.get('path') == rel_path for item in self.inventory['items']):
                    continue
                
                item = self._html_to_item(html_file)
                if item:
                    self._add_item(item)
                    self.inventory['stats']['html_apps_found'] += 1
                    self.log(f"Found: {html_file.name}", 'success')
    
    def scan_cli_tools(self):
        """Find CLI tools in toolbox-cli/bin"""
        self.log("Scanning for CLI tools...")
        
        bin_dir = self.hub_root / "10-repos-central" / "toolbox-cli" / "bin"
        if not bin_dir.exists():
            self.log("toolbox-cli/bin not found", 'warning')
            return
        
        for tool_file in bin_dir.iterdir():
            if tool_file.is_file() and not tool_file.name.startswith('.'):
                item = self._cli_to_item(tool_file)
                self._add_item(item)
                self.inventory['stats']['cli_tools_found'] += 1
                self.log(f"CLI: {tool_file.name}", 'success')
    
    def scan_docs(self):
        """Find documentation files"""
        self.log("Scanning for documentation...")
        
        doc_extensions = {'.md', '.txt', '.rst'}
        doc_locations = [
            self.hub_root / "10-repos-central" / "toolbox-cli" / "docs",
            self.hub_root / "10-repos-central" / "hineni" / "docs",
            self.hub_root / "10-repos-central" / "CODEX-MONAD" / "docs",
        ]
        
        for location in doc_locations:
            if not location.exists():
                continue
                
            for doc_file in location.iterdir():
                if doc_file.suffix.lower() in doc_extensions:
                    item = self._doc_to_item(doc_file)
                    self._add_item(item)
                    self.inventory['stats']['docs_found'] += 1
                    self.log(f"Doc: {doc_file.name}", 'success')
    
    def scan_known_locations(self):
        """Add known important directories"""
        self.log("Registering known locations...")
        
        known = [
            {
                'name': 'CODEX-MONAD Portal',
                'path': '10-repos-central/CODEX-MONAD',
                'type': 'folder',
                'category': 'repos',
                'icon': '🌀',
                'description': 'The consciousness portal - you are here',
                'status': 'transcendent'
            },
            {
                'name': 'Toolbox CLI',
                'path': '10-repos-central/toolbox-cli',
                'type': 'folder',
                'category': 'repos',
                'icon': '🧰',
                'description': 'Command line tool collection'
            },
            {
                'name': 'HINENI System',
                'path': '10-repos-central/hineni',
                'type': 'folder',
                'category': 'repos',
                'icon': '🧭',
                'description': 'Core consciousness infrastructure'
            },
            {
                'name': 'Conflict Lab',
                'path': '10-repos-central/conflict-lab',
                'type': 'folder',
                'category': 'conflict-lab',
                'icon': '⚖️',
                'description': 'Game theory and conflict simulation'
            },
            {
                'name': 'AI Datasets',
                'path': '50-ai/datasets-origin',
                'type': 'folder',
                'category': 'ai-infra',
                'icon': '🧬',
                'description': 'Source datasets for AI experiments'
            },
            {
                'name': 'AI Models',
                'path': '50-ai/models-origin',
                'type': 'folder',
                'category': 'ai-infra',
                'icon': '🧠',
                'description': 'Model checkpoints and weights'
            },
            {
                'name': 'Archives',
                'path': '40-archive',
                'type': 'folder',
                'category': 'archives',
                'icon': '🗄️',
                'description': 'Historical archives and backups'
            }
        ]
        
        for item in known:
            full_path = self.hub_root / item['path']
            if full_path.exists():
                item['id'] = self._make_id(item['name'])
                item['status'] = item.get('status', 'active')
                self._add_item(item)
                self.log(f"Registered: {item['name']}", 'success')
    
    # ═══════════════════════════════════════════════════════════════════
    # HELPERS
    # ═══════════════════════════════════════════════════════════════════
    
    def _should_skip(self, path):
        """Check if path should be skipped"""
        parts = path.parts
        return any(skip in parts for skip in SKIP_DIRS)
    
    def _make_id(self, name, path=None, item_type=None):
        """Generate a deterministic ID from path + type (preferred) or name"""
        if path:
            # Deterministic: based on relative path + type
            import hashlib
            id_source = f"{path}:{item_type or 'unknown'}"
            return hashlib.sha1(id_source.encode()).hexdigest()[:12]
        # Fallback to name-based (less stable)
        return name.lower().replace(' ', '-').replace('_', '-')
    
    def _make_entry(self, path, item_type):
        """Generate portal-relative entry path for items the browser can open"""
        if item_type not in ('html', 'doc'):
            return None
        
        rel_path = str(path)
        portal_base = '10-repos-central/CODEX-MONAD/'
        
        # If inside CODEX-MONAD, path is relative to portal
        if rel_path.startswith(portal_base):
            return rel_path[len(portal_base):]
        
        # Otherwise, go up from portal to hub root
        return '../../' + rel_path
    
    def _guess_category(self, path):
        """Guess category from path"""
        path_str = str(path).lower()
        
        if 'toolbox-cli/bin' in path_str:
            return 'toolbox-cli'
        if 'toolbox-cli' in path_str:
            return 'toolbox-cli'
        if 'hineni' in path_str:
            return 'hineni-system'
        if 'conflict-lab' in path_str:
            return 'conflict-lab'
        if 'codex-monad/apps' in path_str:
            return 'web-apps'
        if '.html' in path_str:
            return 'web-apps'
        if '/docs/' in path_str:
            return 'docs'
        if '40-archive' in path_str:
            return 'archives'
        if '50-ai' in path_str:
            return 'ai-infra'
            
        return 'discovered'
    
    def _guess_icon(self, name, file_type):
        """Guess an appropriate icon"""
        name_lower = name.lower()
        
        icon_map = {
            'triage': '🏥',
            'doctor': '🩺',
            'prana': '🌬️',
            'oracle': '🔮',
            'snapshot': '📷',
            'scaffold': '🏗️',
            'focus': '🎯',
            'git': '🌿',
            'icloud': '☁️',
            'dns': '🌐',
            'finder': '🔄',
            'wifi': '📶',
            'game': '🎲',
            'salad': '🥗',
            'samson': '🦁',
            'bureaucra': '📋',
            'hypergraph': '🕸️',
            'polywrite': '✍️',
        }
        
        for key, icon in icon_map.items():
            if key in name_lower:
                return icon
        
        type_icons = {
            'html': '🚀',
            'cli': '💻',
            'doc': '📄',
            'folder': '📂'
        }
        
        return type_icons.get(file_type, '📦')
    
    def _manifest_to_item(self, manifest, manifest_path):
        """Convert a HINENI.manifest to inventory item"""
        identity = manifest.get('identity', {})
        invoke = manifest.get('invoke', {})
        rel_path = str(manifest_path.parent.relative_to(self.hub_root))
        item_type = manifest.get('type', 'unknown')
        
        return {
            'id': self._make_id(identity.get('name', manifest_path.parent.name), rel_path, item_type),
            'name': identity.get('name', manifest_path.parent.name),
            'description': identity.get('description', ''),
            'icon': identity.get('icon', '📦'),
            'status': identity.get('status', 'active'),
            'type': item_type,
            'category': manifest.get('category', self._guess_category(manifest_path)),
            'path': rel_path,
            'entry': self._make_entry(rel_path, item_type),
            'invoke': invoke,
            'tags': manifest.get('tags', []),
            'from_manifest': True
        }
    
    def _html_to_item(self, html_path):
        """Convert an HTML file to inventory item"""
        name = html_path.stem.replace('-', ' ').replace('_', ' ').title()
        rel_path = str(html_path.relative_to(self.hub_root))
        
        # Try to extract title from HTML
        try:
            with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(2000)  # Just read start
                if '<title>' in content:
                    start = content.find('<title>') + 7
                    end = content.find('</title>')
                    if end > start:
                        name = content[start:end].strip()
                        # Clean up common patterns
                        name = name.split('|')[0].strip()
                        name = name.split('-')[0].strip()
        except:
            pass
        
        return {
            'id': self._make_id(html_path.stem, rel_path, 'html'),
            'name': name,
            'description': f'HTML application: {html_path.name}',
            'icon': self._guess_icon(name, 'html'),
            'status': 'active',
            'type': 'html',
            'category': self._guess_category(html_path),
            'path': rel_path,
            'entry': self._make_entry(rel_path, 'html'),
            'invoke': {'entry': rel_path}
        }
    
    def _cli_to_item(self, cli_path):
        """Convert a CLI tool to inventory item"""
        name = cli_path.name.replace('-', ' ').replace('_', ' ').title()
        rel_path = str(cli_path.relative_to(self.hub_root))
        
        return {
            'id': self._make_id(cli_path.name, rel_path, 'cli'),
            'name': name,
            'description': f'CLI tool: {cli_path.name}',
            'icon': self._guess_icon(cli_path.name, 'cli'),
            'status': 'active',
            'type': 'cli',
            'category': 'toolbox-cli',
            'path': rel_path,
            'entry': None,  # CLI tools don't have browser entry
            'invoke': {
                'command': cli_path.name,
                'argsDefault': ['--help']
            }
        }
    
    def _doc_to_item(self, doc_path):
        """Convert a doc file to inventory item"""
        name = doc_path.stem.replace('-', ' ').replace('_', ' ').title()
        rel_path = str(doc_path.relative_to(self.hub_root))
        
        return {
            'id': self._make_id(doc_path.stem, rel_path, 'doc'),
            'name': name,
            'description': f'Documentation: {doc_path.name}',
            'icon': '📄',
            'status': 'active',
            'type': 'doc',
            'category': 'docs',
            'path': rel_path,
            'entry': self._make_entry(rel_path, 'doc')
        }
    
    def _add_item(self, item):
        """Add item to inventory and category"""
        # Avoid duplicates
        if any(existing['id'] == item['id'] for existing in self.inventory['items']):
            return
            
        self.inventory['items'].append(item)
        
        category = item.get('category', 'discovered')
        if category in self.inventory['categories']:
            self.inventory['categories'][category]['items'].append(item['id'])
    
    def save(self, output_path):
        """Save inventory to JSON file"""
        with open(output_path, 'w') as f:
            json.dump(self.inventory, f, indent=2)
        print(f"Saved: {output_path}")


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

def main():
    hub_root = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_HUB_ROOT
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(hub_root):
        print(f"Error: Hub not found at {hub_root}")
        print("Is HINENI_HUB mounted?")
        sys.exit(1)
    
    scanner = HubScanner(hub_root)
    inventory = scanner.scan()
    
    # Determine output path
    if output_file:
        output_path = output_file
    else:
        output_path = os.path.join(hub_root, DEFAULT_OUTPUT)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    scanner.save(output_path)
    
    print("\n✓ Hub inventory ready")
    print(f"  {inventory['stats']['total_items']} items discovered")
    print(f"  {inventory['stats']['manifests_found']} HINENI manifests")
    print(f"  {inventory['stats']['html_apps_found']} HTML apps")
    print(f"  {inventory['stats']['cli_tools_found']} CLI tools")
    print(f"  {inventory['stats']['docs_found']} documents\n")


if __name__ == '__main__':
    main()
