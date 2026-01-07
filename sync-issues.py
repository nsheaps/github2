#!/usr/bin/env python3
"""
Sync GitHub Issues from ISSUES_TO_CREATE.md
Simple approach: Use issue title as unique identifier
"""

import json
import os
import re
import subprocess
import sys


def run_gh(args):
    """Run gh CLI command and return output"""
    result = subprocess.run(
        ["gh"] + args,
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout


def parse_issues_file():
    """Parse ISSUES_TO_CREATE.md and extract all issues"""
    with open('ISSUES_TO_CREATE.md', 'r') as f:
        content = f.read()
    
    issues = []
    # Split by issue headers (### 1. Title)
    blocks = re.split(r'^### \d+\. ', content, flags=re.MULTILINE)[1:]
    
    for block in blocks:
        lines = block.split('\n')
        title = lines[0].strip()
        
        # Find description, source, and labels
        desc = []
        source = ""
        labels = ""
        in_desc = False
        
        for line in lines[1:]:
            if line.startswith('**Description:**'):
                in_desc = True
            elif line.startswith('**Source:**'):
                in_desc = False
            elif line.startswith('<https://'):
                source = line.strip('<>')
            elif line.startswith('**Labels:**'):
                labels = line.replace('**Labels:**', '').strip()
                break
            elif in_desc and line.strip():
                desc.append(line)
        
        body = '\n'.join(desc).strip() + f"\n\n**Source:** {source}"
        
        issues.append({
            'title': title,
            'body': body,
            'labels': labels
        })
    
    return issues


def get_existing_issues(repo):
    """Get all existing open issues"""
    output = run_gh([
        'issue', 'list',
        '--repo', repo,
        '--limit', '1000',
        '--state', 'open',
        '--json', 'number,title'
    ])
    return {issue['title']: issue['number'] for issue in json.loads(output)}


def sync_issues(repo):
    """Sync issues from ISSUES_TO_CREATE.md"""
    print("Parsing ISSUES_TO_CREATE.md...")
    desired = parse_issues_file()
    print(f"Found {len(desired)} TODO items\n")
    
    print("Fetching existing open issues...")
    existing = get_existing_issues(repo)
    print(f"Found {len(existing)} existing open issues\n")
    
    print("Syncing...\n")
    created = 0
    skipped = 0
    
    for issue in desired:
        if issue['title'] in existing:
            skipped += 1
        else:
            # Create the issue
            args = [
                'issue', 'create',
                '--repo', repo,
                '--title', issue['title'],
                '--body', issue['body']
            ]
            if issue['labels']:
                args.extend(['--label', issue['labels']])
            
            run_gh(args)
            print(f"  Created: {issue['title']}")
            created += 1
    
    print(f"\nSync complete!")
    print(f"  Created: {created}")
    print(f"  Skipped (already exists): {skipped}")


def main():
    repo = os.environ.get('GITHUB_REPOSITORY', 'nsheaps/github2')
    
    # Check gh auth
    try:
        run_gh(['auth', 'status'])
    except:
        print("Error: gh CLI is not authenticated.", file=sys.stderr)
        sys.exit(1)
    
    sync_issues(repo)


if __name__ == '__main__':
    main()
