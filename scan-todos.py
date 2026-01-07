#!/usr/bin/env python3
"""
Scan codebase for TODO comments and sync with .github/issues/ docs.
Runs on PRs to ensure TODOs in code are documented before merge.

Logic:
- Code YES, Doc NO → Create/update doc (always)
- Code NO, Doc YES → Keep doc (will be handled by main sync)
"""

import hashlib
import os
import re
import subprocess
from pathlib import Path


def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown content"""
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not match:
        return {}, content
    
    frontmatter_text, body = match.groups()
    frontmatter = {}
    
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
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


def scan_todos_in_file(filepath):
    """Scan a file for TODO comments"""
    todos = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for i, line in enumerate(lines, 1):
            # Match TODO comments in various formats
            # // TODO: text, # TODO: text, <!-- TODO: text -->, etc.
            match = re.search(r'(?://|#|<!--|/\*)\s*TODO:?\s*(.+?)(?:-->|\*/)?$', line, re.IGNORECASE)
            if match:
                text = match.group(1).strip()
                todos.append({
                    'file': str(filepath),
                    'line': i,
                    'text': text,
                    'id': hashlib.md5(f"{filepath}:{i}:{text}".encode()).hexdigest()[:12]
                })
    except:
        pass  # Skip files that can't be read
    
    return todos


def scan_all_todos(root_dir='.'):
    """Scan all source files for TODOs"""
    root = Path(root_dir)
    todos = []
    
    # File extensions to scan
    extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.yml', '.yaml', '.json', '.sh', '.css', '.html'}
    
    # Directories to skip
    skip_dirs = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build', '.next'}
    
    for filepath in root.rglob('*'):
        if filepath.is_file() and filepath.suffix in extensions:
            # Skip if in excluded directory
            if any(skip in filepath.parts for skip in skip_dirs):
                continue
            
            file_todos = scan_todos_in_file(filepath)
            todos.extend(file_todos)
    
    return todos


def generate_todo_doc(todo):
    """Generate doc filename and content for a TODO"""
    # Create a slug from the TODO text
    slug = re.sub(r'[^a-z0-9]+', '-', todo['text'].lower())[:50].strip('-')
    filename = f"todo-{todo['id']}-{slug}.md"
    
    # Determine labels based on file type and content
    labels = ['todo']
    if '.py' in todo['file']:
        labels.append('python')
    elif any(ext in todo['file'] for ext in ['.js', '.jsx', '.ts', '.tsx']):
        labels.append('javascript')
    elif '.md' in todo['file']:
        labels.append('documentation')
    elif any(ext in todo['file'] for ext in ['.yml', '.yaml']):
        labels.append('ci-cd')
    
    # Categorize by keywords
    text_lower = todo['text'].lower()
    if any(word in text_lower for word in ['test', 'testing', 'spec']):
        labels.append('testing')
    if any(word in text_lower for word in ['fix', 'bug', 'error']):
        labels.append('bug')
    if any(word in text_lower for word in ['doc', 'document', 'readme']):
        labels.append('documentation')
    
    # Create content
    source_link = f"{todo['file']}#L{todo['line']}"
    
    frontmatter = create_frontmatter(
        title=todo['text'][:100],  # Limit title length
        labels=list(set(labels)),  # Remove duplicates
        assignees=[]
    )
    
    content = f"""{frontmatter}

## TODO from Code

{todo['text']}

**Source**: `{source_link}`

## Context

This TODO was found in the codebase and needs to be addressed.
"""
    
    return filename, content


def get_existing_todo_docs():
    """Get existing TODO docs from .github/issues/"""
    issues_dir = Path('.github/issues')
    if not issues_dir.exists():
        return {}
    
    todo_docs = {}
    for filepath in issues_dir.glob('*todo-*.md'):
        # Extract TODO ID from filename
        match = re.search(r'todo-([a-f0-9]{12})', filepath.name)
        if match:
            todo_id = match.group(1)
            with open(filepath, 'r') as f:
                content = f.read()
            todo_docs[todo_id] = {
                'file': filepath,
                'content': content
            }
    
    return todo_docs


def sync_todos():
    """Main TODO sync logic for PRs"""
    print("Scanning codebase for TODOs...")
    todos = scan_all_todos()
    print(f"Found {len(todos)} TODOs in code")
    
    existing_docs = get_existing_todo_docs()
    print(f"Found {len(existing_docs)} existing TODO docs")
    
    issues_dir = Path('.github/issues')
    issues_dir.mkdir(parents=True, exist_ok=True)
    
    changes_made = False
    created_count = 0
    updated_count = 0
    
    for todo in todos:
        todo_id = todo['id']
        filename, new_content = generate_todo_doc(todo)
        filepath = issues_dir / filename
        
        if todo_id in existing_docs:
            # Check if content changed
            existing_content = existing_docs[todo_id]['content']
            if existing_content != new_content:
                # TODO text changed, update doc
                print(f"Updating TODO doc: {filename}")
                with open(existing_docs[todo_id]['file'], 'w') as f:
                    f.write(new_content)
                subprocess.run(['git', 'add', str(existing_docs[todo_id]['file'])], check=True)
                changes_made = True
                updated_count += 1
        else:
            # New TODO, create doc
            print(f"Creating TODO doc: {filename}")
            with open(filepath, 'w') as f:
                f.write(new_content)
            subprocess.run(['git', 'add', str(filepath)], check=True)
            changes_made = True
            created_count += 1
    
    if changes_made:
        commit_msg = f"Sync TODOs from code: {created_count} created, {updated_count} updated"
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
        print(f"\n✅ {commit_msg}")
    else:
        print("\n✅ All TODOs are already synced")
    
    # Summary
    print(f"\nSummary:")
    print(f"  TODOs in code: {len(todos)}")
    print(f"  TODO docs: {len(existing_docs) + created_count}")
    print(f"  Created: {created_count}")
    print(f"  Updated: {updated_count}")
    
    return changes_made


def main():
    sync_todos()


if __name__ == '__main__':
    main()
