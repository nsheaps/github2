/**
 * TODO scanning logic - finds TODO comments in source code
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { readTextFile } from '../common/file-utils.js';

export interface TodoItem {
  id: string;
  file: string;
  line: number;
  text: string;
}

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  '__pycache__',
  '.venv',
  'venv',
  'dist',
  'build',
  '.next',
  'coverage',
]);

/**
 * Scan a single file for TODO comments
 */
export async function scanFileForTodos(filePath: string): Promise<TodoItem[]> {
  const content = await readTextFile(filePath);
  if (!content) {
    return [];
  }
  
  const todos: TodoItem[] = [];
  const lines = content.split('\n');
  
  // Match TODO comments in various formats:
  // // TODO: text
  // # TODO: text
  // <!-- TODO: text -->
  // /* TODO: text */
  const todoRegex = /(?:\/\/|#|<!--|\/\*)\s*TODO:?\s*(.+?)(?:-->|\*\/)?$/i;
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(todoRegex);
    if (match) {
      const text = match[1].trim();
      const id = createHash('md5')
        .update(`${filePath}:${i + 1}:${text}`)
        .digest('hex')
        .slice(0, 12);
      
      todos.push({
        id,
        file: filePath,
        line: i + 1,
        text,
      });
    }
  }
  
  return todos;
}

/**
 * Recursively scan directory for TODO comments
 */
export async function scanDirectoryForTodos(
  dirPath: string,
  basePath: string = dirPath
): Promise<TodoItem[]> {
  let todos: TodoItem[] = [];
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relativePath = fullPath.startsWith(basePath)
        ? fullPath.slice(basePath.length + 1)
        : fullPath;
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (SKIP_DIRS.has(entry.name)) {
          continue;
        }
        
        // Recursively scan subdirectory
        const subTodos = await scanDirectoryForTodos(fullPath, basePath);
        todos = todos.concat(subTodos);
      } else if (entry.isFile()) {
        // Scan file
        const fileTodos = await scanFileForTodos(relativePath);
        todos = todos.concat(fileTodos);
      }
    }
  } catch (error) {
    console.warn(`Error scanning directory ${dirPath}:`, error);
  }
  
  return todos;
}

/**
 * Scan entire codebase for TODOs
 */
export async function scanAllTodos(rootDir: string = '.'): Promise<TodoItem[]> {
  console.log('Scanning codebase for TODOs...');
  const todos = await scanDirectoryForTodos(rootDir);
  console.log(`Found ${todos.length} TODO comments`);
  return todos;
}
