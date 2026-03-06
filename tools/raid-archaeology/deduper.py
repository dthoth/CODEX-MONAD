#!/usr/bin/env python3
"""
Library Archaeology Toolkit - Deduper
Analyzes catalog manifests to find duplicate files and name collisions.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from collections import defaultdict
from datetime import datetime

def format_size(bytes_size):
    """Format bytes into human-readable size."""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_size < 1024:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024
    return f"{bytes_size:.1f} PB"

def load_manifests(manifest_paths):
    """Load and merge multiple catalog manifests."""
    all_files = []
    sources = []

    for path in manifest_paths:
        path = Path(path)
        if not path.exists():
            print(f"Warning: Manifest not found: {path}", file=sys.stderr)
            continue

        try:
            with open(path, 'r', encoding='utf-8') as f:
                catalog = json.load(f)

            files = catalog.get('files', [])
            all_files.extend(files)
            sources.append({
                'manifest': str(path),
                'root': catalog.get('stats', {}).get('root_path', 'unknown'),
                'file_count': len(files)
            })
            print(f"Loaded: {path} ({len(files):,} files)")

        except json.JSONDecodeError as e:
            print(f"Error parsing {path}: {e}", file=sys.stderr)
        except Exception as e:
            print(f"Error loading {path}: {e}", file=sys.stderr)

    return all_files, sources

def find_duplicates(files):
    """
    Find duplicate files by MD5 hash.

    Returns dict mapping hash -> list of file entries
    """
    by_hash = defaultdict(list)

    for f in files:
        md5 = f.get('md5_hash')
        if md5:  # Skip files without hash
            by_hash[md5].append(f)

    # Filter to only duplicates (2+ files with same hash)
    duplicates = {h: files for h, files in by_hash.items() if len(files) > 1}
    return duplicates

def find_name_collisions(files):
    """
    Find files with same name but different content (different hash).

    Returns dict mapping filename -> list of file entries
    """
    by_name = defaultdict(list)

    for f in files:
        filename = f.get('filename')
        if filename:
            by_name[filename].append(f)

    # Filter to name collisions: same name, different hashes
    collisions = {}
    for name, file_list in by_name.items():
        if len(file_list) > 1:
            # Check if they have different hashes
            hashes = set(f.get('md5_hash') for f in file_list if f.get('md5_hash'))
            if len(hashes) > 1:  # Different content
                collisions[name] = file_list

    return collisions

def calculate_wasted_space(duplicates):
    """
    Calculate space wasted by duplicates.
    (For each duplicate set, all copies except one are "wasted")
    """
    wasted = 0
    for hash_val, files in duplicates.items():
        if files:
            # Size of one copy * (number of copies - 1)
            size = files[0].get('size_bytes', 0)
            wasted += size * (len(files) - 1)
    return wasted

def analyze(files, verbose=True):
    """
    Perform full deduplication analysis.

    Returns analysis dict.
    """
    if verbose:
        print(f"\nAnalyzing {len(files):,} files...")

    # Count files with and without hashes
    with_hash = sum(1 for f in files if f.get('md5_hash'))
    without_hash = len(files) - with_hash

    if without_hash > 0 and verbose:
        print(f"Warning: {without_hash:,} files have no hash (skipped in duplicate detection)")

    # Find duplicates
    duplicates = find_duplicates(files)
    duplicate_file_count = sum(len(f) for f in duplicates.values())

    # Find name collisions
    collisions = find_name_collisions(files)
    collision_file_count = sum(len(f) for f in collisions.values())

    # Calculate stats
    unique_hashes = len(set(f.get('md5_hash') for f in files if f.get('md5_hash')))
    wasted_space = calculate_wasted_space(duplicates)
    total_size = sum(f.get('size_bytes', 0) for f in files)

    analysis = {
        'summary': {
            'analysis_date': datetime.now().isoformat(),
            'total_files': len(files),
            'files_with_hash': with_hash,
            'files_without_hash': without_hash,
            'unique_files': unique_hashes,
            'duplicate_sets': len(duplicates),
            'duplicate_files': duplicate_file_count,
            'name_collision_sets': len(collisions),
            'name_collision_files': collision_file_count,
            'total_size_bytes': total_size,
            'total_size_human': format_size(total_size),
            'wasted_space_bytes': wasted_space,
            'wasted_space_human': format_size(wasted_space),
            'wasted_percentage': (wasted_space / total_size * 100) if total_size > 0 else 0
        },
        'duplicate_groups': [],
        'name_collisions': []
    }

    # Build duplicate groups (sorted by wasted space, largest first)
    dup_groups = []
    for hash_val, file_list in duplicates.items():
        size = file_list[0].get('size_bytes', 0)
        dup_groups.append({
            'md5': hash_val,
            'count': len(file_list),
            'size_each': size,
            'size_each_human': format_size(size),
            'wasted': size * (len(file_list) - 1),
            'wasted_human': format_size(size * (len(file_list) - 1)),
            'files': [f['path'] for f in file_list]
        })

    analysis['duplicate_groups'] = sorted(dup_groups, key=lambda x: -x['wasted'])

    # Build name collision groups
    collision_groups = []
    for name, file_list in collisions.items():
        collision_groups.append({
            'filename': name,
            'count': len(file_list),
            'variants': [
                {
                    'path': f['path'],
                    'size': f.get('size_bytes', 0),
                    'md5': f.get('md5_hash', 'unknown')
                }
                for f in file_list
            ]
        })

    analysis['name_collisions'] = sorted(collision_groups, key=lambda x: -x['count'])

    return analysis

def print_report(analysis):
    """Print human-readable dedup report."""
    s = analysis['summary']

    print(f"\n{'='*60}")
    print("DEDUPLICATION REPORT")
    print(f"{'='*60}")
    print(f"Analysis date:     {s['analysis_date']}")
    print(f"Total files:       {s['total_files']:,}")
    print(f"Files analyzed:    {s['files_with_hash']:,} (with hash)")
    print(f"Unique files:      {s['unique_files']:,}")
    print(f"Total size:        {s['total_size_human']}")

    print(f"\n{'='*60}")
    print("DUPLICATES")
    print(f"{'='*60}")
    print(f"Duplicate sets:    {s['duplicate_sets']:,}")
    print(f"Duplicate files:   {s['duplicate_files']:,}")
    print(f"Space wasted:      {s['wasted_space_human']} ({s['wasted_percentage']:.1f}%)")

    print(f"\n{'='*60}")
    print("NAME COLLISIONS (same name, different content)")
    print(f"{'='*60}")
    print(f"Collision sets:    {s['name_collision_sets']:,}")
    print(f"Files involved:    {s['name_collision_files']:,}")

    # Show top duplicates by wasted space
    if analysis['duplicate_groups']:
        print(f"\n{'='*60}")
        print("TOP 10 DUPLICATE SETS (by wasted space)")
        print(f"{'='*60}")
        for i, group in enumerate(analysis['duplicate_groups'][:10], 1):
            print(f"\n{i}. {group['count']} copies, {group['wasted_human']} wasted")
            print(f"   Size each: {group['size_each_human']}")
            print(f"   MD5: {group['md5']}")
            for path in group['files'][:3]:
                print(f"   - {path}")
            if len(group['files']) > 3:
                print(f"   ... and {len(group['files']) - 3} more")

    # Show some name collisions
    if analysis['name_collisions']:
        print(f"\n{'='*60}")
        print("TOP 10 NAME COLLISIONS")
        print(f"{'='*60}")
        for i, collision in enumerate(analysis['name_collisions'][:10], 1):
            print(f"\n{i}. '{collision['filename']}' ({collision['count']} variants)")
            for var in collision['variants'][:3]:
                print(f"   - {var['path']}")
                print(f"     ({format_size(var['size'])}, {var['md5'][:12]}...)")
            if len(collision['variants']) > 3:
                print(f"   ... and {len(collision['variants']) - 3} more")

def main():
    parser = argparse.ArgumentParser(
        description='Find duplicate files and name collisions in catalog manifests.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s catalog.json
  %(prog)s vault0.json overflow.json system.json -o combined_report.json
  %(prog)s *.json --summary-only
        '''
    )

    parser.add_argument('manifests',
                        nargs='+',
                        help='One or more catalog JSON files')
    parser.add_argument('-o', '--output',
                        default='dedup_report.json',
                        help='Output report file (default: dedup_report.json)')
    parser.add_argument('--summary-only',
                        action='store_true',
                        help='Only print summary, skip detailed output')
    parser.add_argument('-q', '--quiet',
                        action='store_true',
                        help='Suppress terminal output')

    args = parser.parse_args()

    # Load manifests
    files, sources = load_manifests(args.manifests)

    if not files:
        print("Error: No files loaded from manifests", file=sys.stderr)
        sys.exit(1)

    # Analyze
    analysis = analyze(files, verbose=not args.quiet)
    analysis['sources'] = sources

    # Print report
    if not args.quiet:
        print_report(analysis)

    # Write output
    if not args.summary_only:
        output_path = Path(args.output)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

        if not args.quiet:
            print(f"\nReport written to: {output_path}")
            print(f"File size: {format_size(output_path.stat().st_size)}")

if __name__ == '__main__':
    main()
