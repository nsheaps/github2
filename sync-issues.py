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


def scan_todos_in_code():
    """Scan codebase for TODO comments and return list of TODO IDs"""
    import hashlib
    
    todo_ids = set()
    root = Path('.')
    extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.yml', '.yaml', '.json', '.sh', '.css', '.html'}
    skip_dirs = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build', '.next', '.github'}
    
    for filepath in root.rglob('*'):
        if filepath.is_file() and filepath.suffix in extensions:
            if any(skip in filepath.parts for skip in skip_dirs):
                continue
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines, 1):
                    match = re.search(r'(?://|#|<!--|/\*)\s*TODO:?\s*(.+?)(?:-->|\*/)?$', line, re.IGNORECASE)
                    if match:
                        text = match.group(1).strip()
                        todo_id = hashlib.md5(f"{filepath}:{i}:{text}".encode()).hexdigest()[:12]
                        todo_ids.add(todo_id)
            except:
                pass
    
    return todo_ids


def scan_todos_in_code_detailed():
    """Scan codebase for TODO comments and return detailed list"""
    import hashlib
    
    todos = []
    root = Path('.')
    extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.yml', '.yaml', '.json', '.sh', '.css', '.html'}
    skip_dirs = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build', '.next', '.github'}
    
    for filepath in root.rglob('*'):
        if filepath.is_file() and filepath.suffix in extensions:
            if any(skip in filepath.parts for skip in skip_dirs):
                continue
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines, 1):
                    match = re.search(r'(?://|#|<!--|/\*)\s*TODO:?\s*(.+?)(?:-->|\*/)?$', line, re.IGNORECASE)
                    if match:
                        text = match.group(1).strip()
                        todo_id = hashlib.md5(f"{filepath}:{i}:{text}".encode()).hexdigest()[:12]
                        todos.append({
                            'id': todo_id,
                            'file': str(filepath),
                            'line': i,
                            'text': text
                        })
            except:
                pass
    
    return todos


def sync_issues(repo, event_type, changed_files=None):
    """
    Main sync logic implementing the full state machine:
    
    Code NO, Doc NO, Issue YES  → Close issue
    Code NO, Doc YES, Issue YES → Sync doc and issue
    Code NO, Doc YES, Issue NO  → Create issue from doc (normal flow)
    Code YES, Doc NO, Issue NO  → Create doc from code, then create issue
    Code YES, Doc YES, Issue NO → Create issue from doc (normal flow)
    Code YES, Doc YES, Issue YES → Sync doc and issue
    """
    print(f"Syncing issues... (event: {event_type})")
    
    # Scan for TODOs in code
    print("Scanning code for TODOs...")
    code_todos = scan_todos_in_code_detailed()
    code_todo_ids = set(todo['id'] for todo in code_todos)
    print(f"Found {len(code_todo_ids)} TODOs in code")
    
    docs = get_issue_docs()
    github_issues = get_github_issues(repo)
    
    # Categorize docs
    docs_by_number = {d['number']: d for d in docs if d['number']}
    docs_without_number = [d for d in docs if not d['number']]
    
    # Categorize docs by whether they're TODO docs
    todo_docs = {}  # todo_id -> doc
    task_docs_by_number = {}  # number -> doc (non-TODO docs)
    task_docs_without_number = []
    
    for doc in docs:
        # Check if it's a TODO doc (has todo-{id} in filename)
        match = re.search(r'todo-([a-f0-9]{12})', doc['filename'])
        if match:
            todo_id = match.group(1)
            todo_docs[todo_id] = doc
        else:
            if doc['number']:
                task_docs_by_number[doc['number']] = doc
            else:
                task_docs_without_number.append(doc)
    
    github_by_number = {issue['number']: issue for issue in github_issues}
    
    changes_made = False
    docs_to_create = []  # Collect doc creation operations to push last
    
    print(f"\nState analysis:")
    print(f"  Code TODOs: {len(code_todo_ids)}")
    print(f"  TODO docs: {len(todo_docs)}")
    print(f"  Task docs with numbers: {len(task_docs_by_number)}")
    print(f"  Task docs without numbers: {len(task_docs_without_number)}")
    print(f"  GitHub issues: {len(github_by_number)}")
    
    # First pass: Handle Code YES, Doc NO, Issue NO - create docs
    for todo in code_todos:
        todo_id = todo['id']
        if todo_id not in todo_docs:
            # Code YES, Doc NO, Issue NO - create doc
            print(f"Creating doc for TODO in code: {todo['text'][:50]}...")
            
            # Generate doc
            slug = re.sub(r'[^a-z0-9]+', '-', todo['text'].lower())[:50].strip('-')
            filename = f"todo-{todo_id}-{slug}.md"
            
            # Determine labels
            labels = ['todo']
            if '.py' in todo['file']:
                labels.append('python')
            elif any(ext in todo['file'] for ext in ['.js', '.jsx', '.ts', '.tsx']):
                labels.append('javascript')
            
            source_link = f"{todo['file']}#L{todo['line']}"
            frontmatter = create_frontmatter(
                title=todo['text'][:100],
                labels=labels,
                assignees=[]
            )
            
            content = f"""{frontmatter}

## TODO from Code

{todo['text']}

**Source**: `{source_link}`

## Context

This TODO was found in the codebase and needs to be addressed.
"""
            
            docs_to_create.append({
                'filename': filename,
                'content': content,
                'todo_id': todo_id
            })
    
    # Create the docs for Code YES, Doc NO, Issue NO
    for doc_info in docs_to_create:
        filepath = Path('.github/issues') / doc_info['filename']
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'w') as f:
            f.write(doc_info['content'])
        git_add(filepath)
        print(f"  Created doc: {doc_info['filename']}")
        
        # Add to todo_docs so subsequent logic can process it
        todo_docs[doc_info['todo_id']] = {
            'file': filepath,
            'filename': doc_info['filename'],
            'number': None,
            'frontmatter': parse_frontmatter(doc_info['content'])[0],
            'body': parse_frontmatter(doc_info['content'])[1],
            'full_content': doc_info['content']
        }
    
    if docs_to_create:
        changes_made = True
    
    # Handle TODO docs: Code NO, Doc YES cases
    for todo_id, doc in todo_docs.items():
        code_exists = todo_id in code_todo_ids
        issue_exists = doc['number'] and doc['number'] in github_by_number
        
        if not code_exists and not issue_exists and doc['number']:
            # Code NO, Doc YES, Issue NO (with number) - orphaned doc, remove number or delete
            print(f"TODO removed from code: {doc['filename']} (had issue #{doc['number']}) - keeping doc")
        elif not code_exists and issue_exists:
            # Code NO, Doc YES, Issue YES - sync doc and issue
            print(f"Syncing TODO doc {doc['filename']} with issue #{doc['number']}...")
            title = doc['frontmatter'].get('title', 'Untitled')
            labels = doc['frontmatter'].get('labels', [])
            assignees = doc['frontmatter'].get('assignees', [])
            update_github_issue(repo, doc['number'], title, doc['body'], labels, assignees)
        elif code_exists and not issue_exists and not doc['number']:
            # Code YES, Doc YES, Issue NO (without number) - create issue
            print(f"Creating issue for TODO doc {doc['filename']}...")
            title = doc['frontmatter'].get('title', 'Untitled')
            labels = doc['frontmatter'].get('labels', [])
            assignees = doc['frontmatter'].get('assignees', [])
            number = create_github_issue(repo, title, doc['body'], labels, assignees)
            if number:
                new_filename = f"{number}-{doc['filename']}"
                new_path = doc['file'].parent / new_filename
                git_mv(doc['file'], new_path)
                changes_made = True
                print(f"  Created issue #{number}, renamed to {new_filename}")
        elif code_exists and issue_exists:
            # Code YES, Doc YES, Issue YES - sync if doc changed
            if event_type == 'push' and changed_files and str(doc['file']) in changed_files:
                print(f"Syncing TODO doc {doc['filename']} to issue #{doc['number']}...")
                title = doc['frontmatter'].get('title', 'Untitled')
                labels = doc['frontmatter'].get('labels', [])
                assignees = doc['frontmatter'].get('assignees', [])
                update_github_issue(repo, doc['number'], title, doc['body'], labels, assignees)
    
    # Handle task docs without numbers - create issues
    for doc in task_docs_without_number:
        title = doc['frontmatter'].get('title', 'Untitled')
        labels = doc['frontmatter'].get('labels', [])
        assignees = doc['frontmatter'].get('assignees', [])
        
        print(f"Creating issue for task doc {doc['filename']}...")
        number = create_github_issue(repo, title, doc['body'], labels, assignees)
        
        if number:
            new_filename = f"{number}-{doc['filename']}"
            new_path = doc['file'].parent / new_filename
            git_mv(doc['file'], new_path)
            changes_made = True
            print(f"  Created issue #{number}, renamed to {new_filename}")
    
    # Handle task docs with numbers - sync if changed
    for number, doc in task_docs_by_number.items():
        if number not in github_by_number:
            # Doc YES, Issue NO - do nothing per original spec
            print(f"Task doc {doc['filename']} has number but no GitHub issue - skipping")
            continue
        
        # Doc YES, Issue YES - sync if changed
        if event_type == 'push' and changed_files and str(doc['file']) in changed_files:
            print(f"Syncing task doc {doc['filename']} to issue #{number}...")
            title = doc['frontmatter'].get('title', 'Untitled')
            labels = doc['frontmatter'].get('labels', [])
            assignees = doc['frontmatter'].get('assignees', [])
            update_github_issue(repo, number, title, doc['body'], labels, assignees)
    
    # Handle GitHub issues without docs - Code NO, Doc NO, Issue YES → Close
    all_doc_numbers = set(d['number'] for d in docs if d['number'])
    for number, issue in github_by_number.items():
        if number not in all_doc_numbers:
            print(f"Closing issue #{number} (no matching doc - Code NO, Doc NO, Issue YES)...")
            close_github_issue(repo, number, "Cancelled - no matching documentation found")
    
    # Commit and push all changes in the right order
    # First commit any doc creations (Code YES, Doc NO -> Doc created)
    # Then commit any file renames (issue number additions)
    # This ensures push doesn't trigger duplicate logic
    if changes_made:
        try:
            # Check if there are any staged changes
            result = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
            if result.returncode != 0:  # There are staged changes
                git_commit_and_push("Sync issues: create docs and add issue numbers")
        except subprocess.CalledProcessError:
            # Commit might fail if no changes, that's ok
            pass
    
    print("\n✅ Sync complete!")


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
