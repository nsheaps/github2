/**
 * Issue document management - reading and parsing issue docs
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { readTextFile } from '../common/file-utils.js';
import { parseFrontmatter, Frontmatter } from '../common/yaml-frontmatter.js';

export interface IssueDoc {
  file: string;
  filename: string;
  number: number | null;
  frontmatter: Frontmatter;
  body: string;
  fullContent: string;
  isTodoDoc: boolean;
  todoId?: string;
}

/**
 * Extract issue number from filename if present
 * Formats: "123-title.md" or "123-todo-abc123-title.md"
 */
function extractIssueNumber(filename: string): number | null {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract TODO ID from filename if it's a TODO doc
 * Format: "todo-{12-hex}-slug.md" or "{number}-todo-{12-hex}-slug.md"
 */
function extractTodoId(filename: string): string | undefined {
  const match = filename.match(/todo-([a-f0-9]{12})/);
  return match ? match[1] : undefined;
}

/**
 * Get all issue docs from .github/issues/
 */
export async function getAllIssueDocs(issuesDir: string): Promise<IssueDoc[]> {
  const docs: IssueDoc[] = [];
  
  try {
    const files = await readdir(issuesDir);
    
    for (const filename of files) {
      if (!filename.endsWith('.md')) {
        continue;
      }
      
      const filePath = join(issuesDir, filename);
      const content = await readTextFile(filePath);
      
      if (!content) {
        continue;
      }
      
      const { frontmatter, body } = parseFrontmatter(content);
      const number = extractIssueNumber(filename);
      const todoId = extractTodoId(filename);
      
      docs.push({
        file: filePath,
        filename,
        number,
        frontmatter,
        body,
        fullContent: content,
        isTodoDoc: todoId !== undefined,
        todoId,
      });
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(`Error reading issues directory:`, error);
    }
  }
  
  return docs;
}

/**
 * Categorize docs by type and number
 */
export interface CategorizedDocs {
  todoDocs: Map<string, IssueDoc>; // todoId -> doc
  taskDocs: IssueDoc[]; // Non-TODO docs
  docsWithNumber: Map<number, IssueDoc>; // number -> doc
  docsWithoutNumber: IssueDoc[];
}

export function categorizeDocs(docs: IssueDoc[]): CategorizedDocs {
  const todoDocs = new Map<string, IssueDoc>();
  const taskDocs: IssueDoc[] = [];
  const docsWithNumber = new Map<number, IssueDoc>();
  const docsWithoutNumber: IssueDoc[] = [];
  
  for (const doc of docs) {
    if (doc.isTodoDoc && doc.todoId) {
      todoDocs.set(doc.todoId, doc);
    } else {
      taskDocs.push(doc);
    }
    
    if (doc.number) {
      docsWithNumber.set(doc.number, doc);
    } else {
      docsWithoutNumber.push(doc);
    }
  }
  
  return { todoDocs, taskDocs, docsWithNumber, docsWithoutNumber };
}
