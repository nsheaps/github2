/**
 * TODO documentation generator
 */

import { join, basename } from 'path';
import { TodoItem } from './scanner.js';
import {
  createMarkdownWithFrontmatter,
  Frontmatter,
  parseFrontmatter,
} from '../common/yaml-frontmatter.js';
import { readTextFile, writeTextFile } from '../common/file-utils.js';

/**
 * Generate a slug from text (URL-friendly string)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

/**
 * Determine labels for a TODO based on file type and content
 */
function determineLabels(todo: TodoItem): string[] {
  const labels = new Set<string>(['todo']);
  
  // File type labels
  if (todo.file.match(/\.py$/)) {
    labels.add('python');
  } else if (todo.file.match(/\.(js|jsx|ts|tsx)$/)) {
    labels.add('javascript');
  } else if (todo.file.match(/\.md$/)) {
    labels.add('documentation');
  } else if (todo.file.match(/\.(yml|yaml)$/)) {
    labels.add('ci-cd');
  }
  
  // Content-based labels
  const textLower = todo.text.toLowerCase();
  if (/test|testing|spec/.test(textLower)) {
    labels.add('testing');
  }
  if (/fix|bug|error/.test(textLower)) {
    labels.add('bug');
  }
  if (/doc|document|readme/.test(textLower)) {
    labels.add('documentation');
  }
  
  return Array.from(labels);
}

/**
 * Generate markdown documentation for a TODO
 */
export function generateTodoDoc(todo: TodoItem): {
  filename: string;
  content: string;
} {
  const slug = slugify(todo.text);
  const filename = `todo-${todo.id}-${slug}.md`;
  
  const frontmatter: Frontmatter = {
    title: todo.text.slice(0, 100),
    labels: determineLabels(todo),
    assignees: [],
  };
  
  const sourceLink = `${todo.file}#L${todo.line}`;
  const body = `## TODO from Code

${todo.text}

**Source**: \`${sourceLink}\`

## Context

This TODO was found in the codebase and needs to be addressed.`;
  
  const content = createMarkdownWithFrontmatter(frontmatter, body);
  
  return { filename, content };
}

/**
 * Check if a TODO doc exists and if content has changed
 */
export async function checkTodoDoc(
  issuesDir: string,
  todoId: string
): Promise<{ exists: boolean; file?: string; content?: string }> {
  const { readdir } = await import('fs/promises');
  
  try {
    const files = await readdir(issuesDir);
    
    for (const file of files) {
      if (file.includes(`todo-${todoId}`)) {
        const filePath = join(issuesDir, file);
        const content = await readTextFile(filePath);
        
        return {
          exists: true,
          file: filePath,
          content: content || undefined,
        };
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return { exists: false };
}

/**
 * Save or update a TODO doc
 */
export async function saveTodoDoc(
  issuesDir: string,
  filename: string,
  content: string
): Promise<string> {
  const filePath = join(issuesDir, filename);
  await writeTextFile(filePath, content);
  return filePath;
}
