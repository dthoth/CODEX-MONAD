#!/usr/bin/env python3
"""
generate-codex-manifest.py
pass
Scans the apps/ directory, reads app.json files, and generates
codex-apps.json in the format expected by hineni-hub.js.
pass
Author: Rev. Lux Luther (via Claude)
Date: 2026-01-19
"""

import os
import json
from pathlib import Path

def scan_apps_directory(apps_dir="apps"):
    """
    Scan the apps directory and collect all app.json files.
    
    Returns:
        list: List of tuples (app_dir, app_data)
    """
    apps = []
    
    if not os.path.exists(apps_dir):
        print(f"❌ Apps directory not found: {apps_dir}")
        return apps
    
    print(f"📁 Scanning directory: {apps_dir}/")
    
    for entry in sorted(os.listdir(apps_dir)):
        app_path = os.path.join(apps_dir, entry)
        
        if not os.path.isdir(app_path):
            continue
        
        app_json_path = os.path.join(app_path, "app.json")
        
        if os.path.exists(app_json_path):
            try:
                with open(app_json_path, 'r', encoding='utf-8') as f:
                    app_data = json.load(f)
                apps.append((entry, app_data))
                print(f"   ✅ {entry}/app.json")
            except json.JSONDecodeError as e:
                print(f"   ❌ {entry}/app.json - Invalid JSON: {e}")
            except Exception as e:
                print(f"   ❌ {entry}/app.json - Error: {e}")
        else:
            print(f"   ⚠️  {entry}/ - No app.json found")
    
    return apps

def transform_to_manifest_format(app_dir, app_data):
    """
    Transform app.json format to hineni-hub.json manifest format.
    
    Args:
        app_dir (str): Directory name of the app
        app_data (dict): Parsed app.json data
    
    Returns:
        dict: Manifest entry
    """
    # Compute hubPath
    entry_file = app_data.get('entry', 'index.html')
    hub_path = f"apps/{app_dir}/{entry_file}"
    
    # Map fields
    manifest_entry = {
        "id": app_data.get('id', app_dir),
        "label": app_data.get('name', app_dir.replace('_', ' ').title()),
        "icon": app_data.get('icon', '📦'),
        "status": "active",  # Default status
        "description": app_data.get('description', ''),
        "hubPath": hub_path,
        "isLocal": True,
        "launchType": app_data.get('kind', 'html')
    }
    
    # Optional fields
    if 'command' in app_data:
        manifest_entry['command'] = app_data['command']
    
    if 'version' in app_data:
        manifest_entry['version'] = app_data['version']
    
    if 'author' in app_data:
        manifest_entry['author'] = app_data['author']
    
    return manifest_entry

def validate_manifest(manifest_entries):
    """
    Validate the generated manifest for issues.
    
    Returns:
        tuple: (is_valid, errors)
    """
    errors = []
    ids = []
    
    required_fields = ['id', 'label', 'icon', 'status', 'description', 'hubPath']
    
    for i, entry in enumerate(manifest_entries):
        # Check required fields
        for field in required_fields:
            if field not in entry or not entry[field]:
                errors.append(f"Entry {i} ({entry.get('id', 'unknown')}): missing '{field}'")
        
        # Check for duplicate IDs
        entry_id = entry.get('id')
        if entry_id in ids:
            errors.append(f"Duplicate ID: {entry_id}")
        ids.append(entry_id)
    
    return len(errors) == 0, errors

def generate_manifest(output_file="codex-apps.json", apps_dir="apps"):
    """
    Main function to generate the manifest.
    """
    print("\n" + "=" * 75)
    print("CODEX-MONAD MANIFEST GENERATOR")
    print("=" * 75 + "\n")
    
    # Scan apps directory
    apps = scan_apps_directory(apps_dir)
    
    if not apps:
        print("\n❌ No apps found. Nothing to generate.")
        return False
    
    print(f"\n📊 Found {len(apps)} apps with app.json files\n")
    
    # Transform to manifest format
    print("🔄 Transforming to manifest format...")
    manifest_entries = []
    
    for app_dir, app_data in apps:
        manifest_entry = transform_to_manifest_format(app_dir, app_data)
        manifest_entries.append(manifest_entry)
        print(f"   ✅ {manifest_entry['id']}: {manifest_entry['label']}")
    
    # Sort by id
    manifest_entries.sort(key=lambda x: x['id'])
    
    # Validate
    print("\n✓ Validating manifest...")
    is_valid, errors = validate_manifest(manifest_entries)
    
    if not is_valid:
        print("\n❌ Validation errors:")
        for error in errors:
            print(f"   - {error}")
        return False
    
    print("   ✅ Validation passed")
    
    # Write output
    print(f"\n💾 Writing to {output_file}...")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(manifest_entries, f, indent=2, ensure_ascii=False)
        
        print(f"   ✅ Manifest written successfully")
        
        # Show stats
        file_size = os.path.getsize(output_file)
        print(f"\n📈 Statistics:")
        print(f"   - Apps: {len(manifest_entries)}")
        print(f"   - File size: {file_size:,} bytes")
        print(f"   - Output: {output_file}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error writing file: {e}")
        return False

if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    apps_dir = sys.argv[1] if len(sys.argv) > 1 else "apps"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "codex-apps.json"
    
    success = generate_manifest(output_file, apps_dir)
    
    if success:
        print("\n" + "=" * 75)
        print("✅ MANIFEST GENERATION COMPLETE")
        print("=" * 75)
        print("\nNext steps:")
        print("  1. Review codex-apps.json")
        print("  2. Update hineni-hub.js to load this manifest")
        print("  3. Test in browser\n")
        sys.exit(0)
    else:
        print("\n" + "=" * 75)
        print("❌ MANIFEST GENERATION FAILED")
        print("=" * 75 + "\n")
        sys.exit(1)
