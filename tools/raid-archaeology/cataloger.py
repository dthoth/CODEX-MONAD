#!/usr/bin/env python3
"""
Library Archaeology Toolkit - Cataloger
Recursively catalogs files with metadata and optional MD5 hashing.
Designed for massive directories (19,000+ files across multiple volumes).
"""

import os
import sys
import json
import hashlib
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict

# Files to skip (macOS metadata)
SKIP_PATTERNS = {'.DS_Store', '._.'}

def should_skip(filename):
    """Check if file should be skipped (but counted)."""
    if filename == '.DS_Store':
        return True
    if filename.startswith('._'):
        return True
    return False

def get_md5(filepath, chunk_size=8192):
    """Calculate MD5 hash of file. Returns None on error."""
    hasher = hashlib.md5()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(chunk_size):
                hasher.update(chunk)
        return hasher.hexdigest()
    except (PermissionError, OSError):
        return None

def format_size(bytes_size):
    """Format bytes into human-readable size."""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_size < 1024:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024
    return f"{bytes_size:.1f} PB"

def count_files_estimate(root_path):
    """Quick estimate of file count for progress indicator."""
    count = 0
    try:
        for entry in os.scandir(root_path):
            if entry.is_file():
                count += 1
            elif entry.is_dir() and not entry.name.startswith('.'):
                # Only go one level deep for estimate
                try:
                    count += sum(1 for _ in os.scandir(entry.path))
                except (PermissionError, OSError):
                    count += 100  # Guess for inaccessible dirs
    except (PermissionError, OSError):
        pass
    return max(count, 100)  # Minimum estimate

def catalog_directory(root_path, compute_hash=True, verbose=True):
    """
    Walk directory tree and catalog all files.

    Returns:
        dict with 'files', 'stats', 'errors', 'skipped'
    """
    root_path = Path(root_path).resolve()

    if not root_path.exists():
        print(f"Error: Path does not exist: {root_path}", file=sys.stderr)
        sys.exit(1)

    if not root_path.is_dir():
        print(f"Error: Path is not a directory: {root_path}", file=sys.stderr)
        sys.exit(1)

    files = []
    errors = []
    skipped_count = 0
    extension_counts = defaultdict(int)
    total_size = 0

    # Estimate for progress
    estimated_total = count_files_estimate(root_path) if verbose else 0
    processed = 0

    if verbose:
        print(f"Scanning: {root_path}")
        print(f"Hash computation: {'enabled' if compute_hash else 'disabled'}")
        print("-" * 60)

    for dirpath, dirnames, filenames in os.walk(root_path):
        # Skip hidden directories
        dirnames[:] = [d for d in dirnames if not d.startswith('.')]

        for filename in filenames:
            filepath = Path(dirpath) / filename

            # Skip macOS metadata files
            if should_skip(filename):
                skipped_count += 1
                continue

            processed += 1

            # Progress indicator
            if verbose and processed % 100 == 0:
                pct = min(100, (processed / estimated_total) * 100) if estimated_total > 0 else 0
                print(f"\r[{processed:,} files] {pct:.0f}% ", end='', flush=True)

            try:
                stat = filepath.stat()
                ext = filepath.suffix.lower() if filepath.suffix else '(none)'

                file_entry = {
                    'path': str(filepath),
                    'filename': filename,
                    'extension': ext,
                    'size_bytes': stat.st_size,
                    'modified_date': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'md5_hash': None
                }

                if compute_hash:
                    file_entry['md5_hash'] = get_md5(filepath)
                    if file_entry['md5_hash'] is None:
                        errors.append({
                            'path': str(filepath),
                            'error': 'Could not compute hash'
                        })

                files.append(file_entry)
                extension_counts[ext] += 1
                total_size += stat.st_size

            except PermissionError:
                errors.append({
                    'path': str(filepath),
                    'error': 'Permission denied'
                })
            except OSError as e:
                errors.append({
                    'path': str(filepath),
                    'error': str(e)
                })

    if verbose:
        print(f"\r[{processed:,} files] 100% - Complete!          ")
        print("-" * 60)

    # Build stats
    stats = {
        'root_path': str(root_path),
        'scan_date': datetime.now().isoformat(),
        'total_files': len(files),
        'total_size_bytes': total_size,
        'total_size_human': format_size(total_size),
        'skipped_metadata_files': skipped_count,
        'errors_count': len(errors),
        'hash_computed': compute_hash,
        'extensions': dict(sorted(extension_counts.items(), key=lambda x: -x[1]))
    }

    return {
        'stats': stats,
        'files': files,
        'errors': errors
    }

def print_summary(catalog):
    """Print terminal summary of catalog."""
    stats = catalog['stats']

    print(f"\n{'='*60}")
    print(f"CATALOG SUMMARY")
    print(f"{'='*60}")
    print(f"Root:           {stats['root_path']}")
    print(f"Scan date:      {stats['scan_date']}")
    print(f"Total files:    {stats['total_files']:,}")
    print(f"Total size:     {stats['total_size_human']} ({stats['total_size_bytes']:,} bytes)")
    print(f"Skipped:        {stats['skipped_metadata_files']:,} metadata files (.DS_Store, ._*)")
    print(f"Errors:         {stats['errors_count']:,}")
    print(f"Hash computed:  {'Yes' if stats['hash_computed'] else 'No'}")

    print(f"\n{'='*60}")
    print(f"TOP EXTENSIONS")
    print(f"{'='*60}")
    for ext, count in list(stats['extensions'].items())[:15]:
        print(f"  {ext:12} {count:>8,}")

    if len(stats['extensions']) > 15:
        print(f"  ... and {len(stats['extensions']) - 15} more")

    if catalog['errors']:
        print(f"\n{'='*60}")
        print(f"ERRORS (first 10)")
        print(f"{'='*60}")
        for err in catalog['errors'][:10]:
            print(f"  {err['error']}: {err['path']}")

def main():
    parser = argparse.ArgumentParser(
        description='Catalog files in a directory tree with metadata and MD5 hashes.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s /Volumes/Vault-0 -o vault0_catalog.json
  %(prog)s /Volumes/OverflowVault-16TB --no-hash -o overflow_fast.json
  %(prog)s . -o local_catalog.json
        '''
    )

    parser.add_argument('directory',
                        help='Directory to catalog')
    parser.add_argument('-o', '--output',
                        default='catalog.json',
                        help='Output JSON file (default: catalog.json)')
    parser.add_argument('--no-hash',
                        action='store_true',
                        help='Skip MD5 hash computation for faster scanning')
    parser.add_argument('-q', '--quiet',
                        action='store_true',
                        help='Suppress progress output')

    args = parser.parse_args()

    # Run catalog
    catalog = catalog_directory(
        args.directory,
        compute_hash=not args.no_hash,
        verbose=not args.quiet
    )

    # Print summary
    if not args.quiet:
        print_summary(catalog)

    # Write output
    output_path = Path(args.output)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"\nManifest written to: {output_path}")
    print(f"File size: {format_size(output_path.stat().st_size)}")

if __name__ == '__main__':
    main()
