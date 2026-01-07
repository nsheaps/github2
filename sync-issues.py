#!/usr/bin/env python3
"""
Sync GitHub Issues from ISSUES_TO_CREATE.md
This script ensures there's exactly one issue per TODO item, using hash-based deduplication.
"""

import hashlib
import json
import os
import re
import subprocess
import sys


def run_gh_command(args):
    """Run gh CLI command and return output"""
    try:
        result = subprocess.run(
            ["gh"] + args,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running gh command: {e.stderr}", file=sys.stderr)
        raise


def generate_hash(title, source):
    """Generate unique hash for an issue based on title and source"""
    hash_input = f"{title}|{source}"
    return hashlib.sha256(hash_input.encode()).hexdigest()[:16]


def parse_issues_file():
    """Parse ISSUES_TO_CREATE.md and extract all issue definitions"""
    with open('ISSUES_TO_CREATE.md', 'r') as f:
        content = f.read()
    
    issues = []
    # Split by issue headers (e.g., "### 1. Title")
    issue_blocks = re.split(r'^### \d+\. ', content, flags=re.MULTILINE)[1:]
    
    for block in issue_blocks:
        lines = block.split('\n')
        title = lines[0].strip()
        
        # Extract description, source, and labels
        description_lines = []
        source = ""
        labels = ""
        
        in_description = False
        for i, line in enumerate(lines[1:]):
            if line.startswith('**Description:**'):
                in_description = True
                continue
            elif line.startswith('**Source:**'):
                in_description = False
                # Source URL is on next line
                if i + 2 < len(lines):
                    source_line = lines[i + 2].strip()
                    source = source_line.strip('<>')
            elif line.startswith('**Labels:**'):
                labels = line.replace('**Labels:**', '').strip()
                break
            elif in_description and line.strip():
                description_lines.append(line)
        
        description = '\n'.join(description_lines).strip()
        issue_hash = generate_hash(title, source)
        
        issues.append({
            'title': title,
            'description': description,
            'source': source,
            'labels': labels,
            'hash': issue_hash
        })
    
    return issues


def get_existing_issues(repo):
    """Get all existing issues from the repository"""
    output = run_gh_command([
        'issue', 'list',
        '--repo', repo,
        '--limit', '1000',
        '--state', 'all',
        '--json', 'number,title,body,state'
    ])
    return json.loads(output)


def extract_hash_from_body(body):
    """Extract sync hash from issue body HTML comment"""
    if not body:
        return None
    match = re.search(r'<!-- sync-hash: ([a-f0-9]{16}) -->', body)
    return match.group(1) if match else None


def close_issue(repo, issue_number, reason):
    """Close an issue with a comment"""
    comment = f"Closing as {reason}"
    run_gh_command([
        'issue', 'close', str(issue_number),
        '--repo', repo,
        '--comment', comment
    ])
    print(f"  Closed issue #{issue_number}: {reason}")


def create_issue(repo, issue_data):
    """Create a new issue"""
    # Build body with hash comment
    body = f"{issue_data['description']}\n\n"
    body += f"**Source:** {issue_data['source']}\n\n"
    body += f"<!-- sync-hash: {issue_data['hash']} -->"
    
    args = [
        'issue', 'create',
        '--repo', repo,
        '--title', issue_data['title'],
        '--body', body
    ]
    
    if issue_data['labels']:
        args.extend(['--label', issue_data['labels']])
    
    output = run_gh_command(args)
    print(f"  Created: {issue_data['title']}")
    return output


def sync_issues(repo):
    """Main sync logic"""
    print("Parsing ISSUES_TO_CREATE.md...")
    desired_issues = parse_issues_file()
    print(f"Found {len(desired_issues)} TODO items\n")
    
    print("Fetching existing issues...")
    existing_issues = get_existing_issues(repo)
    print(f"Found {len(existing_issues)} existing issues\n")
    
    # Build hash map of existing issues
    hash_to_issues = {}
    for issue in existing_issues:
        issue_hash = extract_hash_from_body(issue.get('body', ''))
        if issue_hash:
            if issue_hash not in hash_to_issues:
                hash_to_issues[issue_hash] = []
            hash_to_issues[issue_hash].append(issue)
    
    print("Syncing issues...\n")
    created = 0
    closed = 0
    skipped = 0
    
    for desired in desired_issues:
        issue_hash = desired['hash']
        existing = hash_to_issues.get(issue_hash, [])
        
        if not existing:
            # No issue exists, create it
            create_issue(repo, desired)
            created += 1
        elif len(existing) == 1 and existing[0]['state'] == 'open':
            # Exactly one open issue, perfect
            skipped += 1
        else:
            # Multiple issues or closed issue exists
            # Keep one open, close the rest
            open_issues = [e for e in existing if e['state'] == 'open']
            closed_issues = [e for e in existing if e['state'] != 'open']
            
            if open_issues:
                # Keep the first open one, close duplicates
                for dup in open_issues[1:]:
                    close_issue(repo, dup['number'], 'duplicate')
                    closed += 1
                skipped += 1
            else:
                # All are closed, reopen one or create new
                # For now, just create a new one
                create_issue(repo, desired)
                created += 1
    
    print(f"\nSync complete!")
    print(f"  Created: {created}")
    print(f"  Closed: {closed}")
    print(f"  Skipped (already exists): {skipped}")


def main():
    repo = os.environ.get('GITHUB_REPOSITORY', 'nsheaps/github2')
    
    # Check if gh is authenticated
    try:
        run_gh_command(['auth', 'status'])
    except:
        print("Error: gh CLI is not authenticated.", file=sys.stderr)
        print("In GitHub Actions, set GH_TOKEN environment variable.", file=sys.stderr)
        sys.exit(1)
    
    sync_issues(repo)


if __name__ == '__main__':
    main()
