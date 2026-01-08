/**
 * Git operations utilities
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Stage a file with git add
 */
export async function gitAdd(filePath: string): Promise<void> {
  await execAsync(`git add "${filePath}"`);
}

/**
 * Move/rename file with git mv (preserves history)
 */
export async function gitMv(oldPath: string, newPath: string): Promise<void> {
  await execAsync(`git mv "${oldPath}" "${newPath}"`);
}

/**
 * Commit staged changes
 */
export async function gitCommit(message: string, skipCi = false): Promise<void> {
  const suffix = skipCi ? ' [skip ci]' : '';
  await execAsync(`git commit -m "${message}${suffix}"`);
}

/**
 * Push commits to remote
 */
export async function gitPush(): Promise<void> {
  await execAsync('git push');
}

/**
 * Check if there are staged changes
 */
export async function hasStagedChanges(): Promise<boolean> {
  try {
    await execAsync('git diff --cached --quiet');
    return false; // Exit code 0 means no changes
  } catch {
    return true; // Exit code 1 means there are changes
  }
}

/**
 * Configure git user for commits
 */
export async function configureGitUser(
  name: string,
  email: string
): Promise<void> {
  await execAsync(`git config user.name "${name}"`);
  await execAsync(`git config user.email "${email}"`);
}
