/**
 * GitHub API wrappers using gh CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  labels: Array<{ name: string }>;
  assignees: Array<{ login: string }>;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueOptions {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
}

/**
 * Run gh CLI command
 */
async function runGh(args: string[]): Promise<string> {
  try {
    const { stdout } = await execAsync(`gh ${args.join(' ')}`);
    return stdout.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`gh CLI error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get all open issues from repository
 */
export async function listOpenIssues(repo: string): Promise<GitHubIssue[]> {
  const output = await runGh([
    'issue',
    'list',
    '--repo',
    repo,
    '--limit',
    '1000',
    '--state',
    'open',
    '--json',
    'number,title,body,labels,assignees,state,createdAt,updatedAt',
  ]);
  
  return JSON.parse(output) as GitHubIssue[];
}

/**
 * Create a new GitHub issue
 */
export async function createIssue(
  repo: string,
  options: CreateIssueOptions
): Promise<number | null> {
  const args = ['issue', 'create', '--repo', repo, '--title', options.title, '--body', options.body];
  
  if (options.labels && options.labels.length > 0) {
    args.push('--label', options.labels.join(','));
  }
  
  if (options.assignees && options.assignees.length > 0) {
    args.push('--assignee', options.assignees.join(','));
  }
  
  const output = await runGh(args);
  
  // Extract issue number from URL
  const match = output.match(/\/issues\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Update an existing GitHub issue
 */
export async function updateIssue(
  repo: string,
  number: number,
  options: Partial<CreateIssueOptions>
): Promise<void> {
  const args = ['issue', 'edit', number.toString(), '--repo', repo];
  
  if (options.title) {
    args.push('--title', options.title);
  }
  
  if (options.body) {
    args.push('--body', options.body);
  }
  
  if (options.labels && options.labels.length > 0) {
    args.push('--add-label', options.labels.join(','));
  }
  
  await runGh(args);
}

/**
 * Close a GitHub issue
 */
export async function closeIssue(
  repo: string,
  number: number,
  comment?: string
): Promise<void> {
  const args = ['issue', 'close', number.toString(), '--repo', repo];
  
  if (comment) {
    args.push('--comment', comment);
  }
  
  await runGh(args);
}

/**
 * Check if gh CLI is authenticated
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await runGh(['auth', 'status']);
    return true;
  } catch {
    return false;
  }
}
