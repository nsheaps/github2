#!/usr/bin/env python3
"""
Sync GitHub Issues with .github/issues/ markdown files.
Bidirectional sync between issue docs and GitHub issues.
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path


def run_gh(args):
    """Run gh CLI command and return output"""
    result = subprocess.run(
        ["gh"] + args,
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout


def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown content"""
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not match:
        return {}, content
    
    frontmatter_text, body = match.groups()
    frontmatter = {}
    
    # Parse simple YAML frontmatter
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            # Handle arrays
            if value.startswith('[') and value.endswith(']'):
                value = [v.strip() for v in value[1:-1].split(',') if v.strip()]
            
            frontmatter[key] = value
    
    return frontmatter, body.strip()


def create_frontmatter(title, labels, assignees):
    """Create YAML frontmatter"""
    labels_str = '[' + ', '.join(labels) + ']' if labels else '[]'
    assignees_str = '[' + ', '.join(assignees) + ']' if assignees else '[]'
    
    return f"""---
title: {title}
labels: {labels_str}
assignees: {assignees_str}
---"""


def get_issue_docs():
    """Get all issue docs from .github/issues/"""
    issues_dir = Path('.github/issues')
    if not issues_dir.exists():
        return []
    
    docs = []
    for file in issues_dir.glob('*.md'):
        with open(file, 'r') as f:
            content = f.read()
        
        frontmatter, body = parse_frontmatter(content)
        
        # Extract issue number from filename if present
        match = re.match(r'^(\d+)-', file.name)
        number = int(match.group(1)) if match else None
        
        docs.append({
            'file': file,
            'filename': file.name,
            'number': number,
            'frontmatter': frontmatter,
            'body': body,
            'full_content': content
        })
    
    return docs


def get_github_issues(repo):
    """Get all open GitHub issues"""
    output = run_gh([
        'issue', 'list',
        '--repo', repo,
        '--limit', '1000',
        '--state', 'open',
        '--json', 'number,title,body,labels,assignees'
    ])
    return json.loads(output)


def create_github_issue(repo, title, body, labels, assignees):
    """Create a GitHub issue"""
    args = [
        'issue', 'create',
        '--repo', repo,
        '--title', title,
        '--body', body
    ]
    
    if labels:
        args.extend(['--label', ','.join(labels)])
    
    if assignees:
        args.extend(['--assignee', ','.join(assignees)])
    
    output = run_gh(args)
    # Extract issue number from URL
    match = re.search(r'/issues/(\d+)', output)
    return int(match.group(1)) if match else None


def update_github_issue(repo, number, title, body, labels, assignees):
    """Update a GitHub issue"""
    args = [
        'issue', 'edit', str(number),
        '--repo', repo,
        '--title', title,
        '--body', body
    ]
    
    if labels:
        args.extend(['--add-label', ','.join(labels)])
    
    run_gh(args)


def close_github_issue(repo, number, reason="Cancelled - no matching doc"):
    """Close a GitHub issue"""
    run_gh([
        'issue', 'close', str(number),
        '--repo', repo,
        '--comment', reason
    ])


def git_mv(old_path, new_path):
    """Rename file with git mv"""
    subprocess.run(['git', 'mv', str(old_path), str(new_path)], check=True)


def git_add(path):
    """Stage file"""
    subprocess.run(['git', 'add', str(path)], check=True)


def git_commit_and_push(message):
    """Commit and push changes with [skip ci]"""
    subprocess.run(['git', 'commit', '-m', f'{message} [skip ci]'], check=True)
    subprocess.run(['git', 'push'], check=True)


def sync_issues(repo, event_type, changed_files=None):
    """Main sync logic"""
    print(f"Syncing issues... (event: {event_type})")
    
    docs = get_issue_docs()
    github_issues = get_github_issues(repo)
    
    # Build mapping
    docs_by_number = {d['number']: d for d in docs if d['number']}
    docs_without_number = [d for d in docs if not d['number']]
    github_by_number = {issue['number']: issue for issue in github_issues}
    
    changes_made = False
    
    # Handle docs without issue numbers - create issues
    for doc in docs_without_number:
        title = doc['frontmatter'].get('title', 'Untitled')
        labels = doc['frontmatter'].get('labels', [])
        assignees = doc['frontmatter'].get('assignees', [])
        
        print(f"Creating issue for {doc['filename']}...")
        number = create_github_issue(repo, title, doc['body'], labels, assignees)
        
        if number:
            # Rename file to include issue number
            new_filename = f"{number}-{doc['filename']}"
            new_path = doc['file'].parent / new_filename
            git_mv(doc['file'], new_path)
            changes_made = True
            print(f"  Created issue #{number}, renamed to {new_filename}")
    
    # Handle docs with numbers - check if issues exist
    for number, doc in docs_by_number.items():
        if number not in github_by_number:
            # Doc exists but no GitHub issue - do nothing per spec
            print(f"Doc {doc['filename']} has number but no GitHub issue - skipping")
            continue
        
        # Both exist - check if sync needed
        if event_type == 'push' and changed_files:
            if str(doc['file']) in changed_files:
                # Doc was updated, sync to GitHub
                title = doc['frontmatter'].get('title', 'Untitled')
                labels = doc['frontmatter'].get('labels', [])
                assignees = doc['frontmatter'].get('assignees', [])
                
                print(f"Syncing doc {doc['filename']} to issue #{number}...")
                update_github_issue(repo, number, title, doc['body'], labels, assignees)
    
    # Handle GitHub issues without docs - close them
    for number, issue in github_by_number.items():
        if number not in docs_by_number:
            print(f"Closing issue #{number} (no matching doc)...")
            close_github_issue(repo, number)
    
    if changes_made:
        git_commit_and_push("Sync issues: add issue numbers to docs")
    
    print("Sync complete!")


def main():
    repo = os.environ.get('GITHUB_REPOSITORY', 'nsheaps/github2')
    event_type = os.environ.get('EVENT_TYPE', 'push')
    changed_files = os.environ.get('CHANGED_FILES', '').split('\n') if os.environ.get('CHANGED_FILES') else None
    
    # Check gh auth
    try:
        run_gh(['auth', 'status'])
    except:
        print("Error: gh CLI is not authenticated.", file=sys.stderr)
        sys.exit(1)
    
    sync_issues(repo, event_type, changed_files)


if __name__ == '__main__':
    main()
