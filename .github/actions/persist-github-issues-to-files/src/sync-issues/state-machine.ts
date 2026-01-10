/**
 * State machine for syncing Code/Doc/Issue states
 * Implements the complete logic for all combinations
 */

import { TodoItem } from '../scan-todos/scanner.js';
import { IssueDoc } from './doc-manager.js';
import { GitHubIssue, createIssue, updateIssue, closeIssue } from '../common/github-api.js';
import { gitMv, gitAdd } from '../common/git-utils.js';
import { join } from 'path';
import { generateTodoDoc, saveTodoDoc } from '../scan-todos/doc-generator.js';

export interface SyncResult {
  created: number;
  updated: number;
  closed: number;
  renamed: number;
  warnings: string[];
}

export interface SyncState {
  codeHasTODO: boolean;
  docExists: boolean;
  issueExists: boolean;
}

export type SyncAction = 
  | 'create_doc_and_issue'
  | 'create_issue'
  | 'create_doc'
  | 'sync_doc_to_issue'
  | 'sync_issue_to_doc'
  | 'close_issue'
  | 'nothing'; // Changed from 'no_action' to match test expectations

/**
 * Determine what action to take based on Code/Doc/Issue state
 */
export function determineAction(state: SyncState): SyncAction {
  const { codeHasTODO, docExists, issueExists } = state;
  
  // Code YES, Doc NO, Issue NO
  if (codeHasTODO && !docExists && !issueExists) {
    return 'create_doc_and_issue';
  }
  
  // Code YES, Doc YES, Issue NO
  if (codeHasTODO && docExists && !issueExists) {
    return 'create_issue';
  }
  
  // Code YES, Doc YES, Issue YES
  if (codeHasTODO && docExists && issueExists) {
    return 'sync_doc_to_issue';
  }
  
  // Code NO, Doc YES, Issue NO
  if (!codeHasTODO && docExists && !issueExists) {
    return 'create_issue';
  }
  
  // Code NO, Doc YES, Issue YES
  if (!codeHasTODO && docExists && issueExists) {
    return 'sync_doc_to_issue';
  }
  
  // Code NO, Doc NO, Issue YES
  if (!codeHasTODO && !docExists && issueExists) {
    return 'close_issue';
  }
  
  // Code NO, Doc NO, Issue NO or Code YES, Doc NO, Issue YES (invalid states)
  return 'nothing';
}

/**
 * Check if issue was modified more recently than doc
 */
function isIssueNewer(issue: GitHubIssue, docPath: string): boolean {
  try {
    const { statSync } = require('fs');
    const docStats = statSync(docPath);
    const issueDate = new Date(issue.updatedAt);
    const docDate = new Date(docStats.mtime);
    return issueDate > docDate;
  } catch {
    return false;
  }
}

/**
 * Handle Code YES, Doc NO, Issue NO - create doc then issue
 */
export async function handleCodeYesDocNoIssueNo(
  todo: TodoItem,
  repo: string,
  issuesDir: string,
  result: SyncResult
): Promise<IssueDoc | null> {
  console.log(`Creating doc for TODO: ${todo.text.slice(0, 50)}...`);
  
  const { filename, content } = generateTodoDoc(todo);
  const filePath = await saveTodoDoc(issuesDir, filename, content);
  await gitAdd(filePath);
  
  result.created++;
  
  // Return the doc info for potential issue creation
  return {
    file: filePath,
    filename,
    number: null,
    frontmatter: { title: todo.text.slice(0, 100), labels: ['todo'], assignees: [] },
    body: content,
    fullContent: content,
    isTodoDoc: true,
    todoId: todo.id,
  };
}

/**
 * Handle Code NO, Doc NO, Issue YES - close orphaned issue
 */
export async function handleCodeNoDocNoIssueYes(
  issue: GitHubIssue,
  repo: string,
  result: SyncResult
): Promise<void> {
  console.log(`Closing orphaned issue #${issue.number}...`);
  await closeIssue(repo, issue.number, 'Cancelled - no matching documentation found');
  result.closed++;
}

/**
 * Handle Code NO, Doc YES, Issue YES - sync doc and issue
 */
export async function handleCodeNoDocYesIssueYes(
  doc: IssueDoc,
  issue: GitHubIssue,
  repo: string,
  eventType: string,
  result: SyncResult
): Promise<void> {
  console.log(`Syncing doc ${doc.filename} with issue #${issue.number}...`);
  
  // Check for conflicts
  if (eventType === 'push' && isIssueNewer(issue, doc.file)) {
    result.warnings.push(
      `Warning: Issue #${issue.number} was updated more recently than doc ${doc.filename}, but syncing doc to issue (push event)`
    );
  }
  
  const title = doc.frontmatter.title || 'Untitled';
  const labels = doc.frontmatter.labels || [];
  const assignees = doc.frontmatter.assignees || [];
  
  await updateIssue(repo, issue.number, { title, body: doc.body, labels, assignees });
  result.updated++;
}

/**
 * Handle Code NO, Doc YES, Issue NO - create issue from doc
 */
export async function handleCodeNoDocYesIssueNo(
  doc: IssueDoc,
  repo: string,
  issuesDir: string,
  result: SyncResult
): Promise<void> {
  console.log(`Creating issue for doc ${doc.filename}...`);
  
  const title = doc.frontmatter.title || 'Untitled';
  const labels = doc.frontmatter.labels || [];
  const assignees = doc.frontmatter.assignees || [];
  
  const number = await createIssue(repo, { title, body: doc.body, labels, assignees });
  
  if (number) {
    // Rename file with issue number
    const newFilename = `${number}-${doc.filename}`;
    const newPath = join(issuesDir, newFilename);
    await gitMv(doc.file, newPath);
    result.created++;
    result.renamed++;
    console.log(`  Created issue #${number}, renamed to ${newFilename}`);
  }
}

/**
 * Handle Code YES, Doc YES, Issue NO - create issue from doc
 */
export async function handleCodeYesDocYesIssueNo(
  doc: IssueDoc,
  repo: string,
  issuesDir: string,
  result: SyncResult
): Promise<void> {
  // Same as Code NO, Doc YES, Issue NO
  await handleCodeNoDocYesIssueNo(doc, repo, issuesDir, result);
}

/**
 * Handle Code YES, Doc YES, Issue YES - sync if doc changed
 */
export async function handleCodeYesDocYesIssueYes(
  doc: IssueDoc,
  issue: GitHubIssue,
  repo: string,
  eventType: string,
  changedFiles: string[] | null,
  result: SyncResult
): Promise<void> {
  // Only sync if doc was in changed files (push event)
  if (eventType === 'push' && changedFiles && changedFiles.includes(doc.file)) {
    console.log(`Syncing doc ${doc.filename} to issue #${issue.number}...`);
    
    // Check for conflicts
    if (isIssueNewer(issue, doc.file)) {
      result.warnings.push(
        `Warning: Issue #${issue.number} was updated more recently than doc ${doc.filename}, but syncing doc to issue (push event)`
      );
    }
    
    const title = doc.frontmatter.title || 'Untitled';
    const labels = doc.frontmatter.labels || [];
    const assignees = doc.frontmatter.assignees || [];
    
    await updateIssue(repo, issue.number, { title, body: doc.body, labels, assignees });
    result.updated++;
  }
}
