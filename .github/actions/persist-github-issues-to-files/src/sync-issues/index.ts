#!/usr/bin/env node
/**
 * Main entry point for syncing GitHub Issues with documentation files
 * Implements comprehensive state machine for Code/Doc/Issue combinations
 */

import { scanAllTodos } from '../scan-todos/scanner.js';
import { getAllIssueDocs, categorizeDocs } from './doc-manager.js';
import { listOpenIssues, checkAuth } from '../common/github-api.js';
import { gitCommit, hasStagedChanges, gitPush } from '../common/git-utils.js';
import {
  handleCodeYesDocNoIssueNo,
  handleCodeNoDocNoIssueYes,
  handleCodeNoDocYesIssueYes,
  handleCodeNoDocYesIssueNo,
  handleCodeYesDocYesIssueNo,
  handleCodeYesDocYesIssueYes,
  SyncResult,
} from './state-machine.js';

const ISSUES_DIR = '.github/issues';

async function main() {
  console.log('=== Sync Issues ===\n');
  
  // Environment
  const repo = process.env.GITHUB_REPOSITORY || 'nsheaps/github2';
  const eventType = process.env.EVENT_TYPE || 'push';
  const changedFilesStr = process.env.CHANGED_FILES || '';
  const changedFiles = changedFilesStr ? changedFilesStr.split('\n').filter(Boolean) : null;
  
  // Check authentication
  if (!(await checkAuth())) {
    console.error('Error: gh CLI is not authenticated');
    process.exit(1);
  }
  
  console.log(`Repository: ${repo}`);
  console.log(`Event: ${eventType}\n`);
  
  // Scan code for TODOs
  const todos = await scanAllTodos();
  const todoIds = new Set(todos.map((t) => t.id));
  
  // Get issue docs
  const docs = await getAllIssueDocs(ISSUES_DIR);
  const { todoDocs, taskDocs, docsWithNumber, docsWithoutNumber } = categorizeDocs(docs);
  
  // Get GitHub issues
  const issues = await listOpenIssues(repo);
  const issuesByNumber = new Map(issues.map((i) => [i.number, i]));
  
  console.log('State analysis:');
  console.log(`  TODOs in code: ${todos.length}`);
  console.log(`  TODO docs: ${todoDocs.size}`);
  console.log(`  Task docs: ${taskDocs.length}`);
  console.log(`  Docs with numbers: ${docsWithNumber.size}`);
  console.log(`  Docs without numbers: ${docsWithoutNumber.length}`);
  console.log(`  GitHub issues: ${issues.length}\n`);
  
  const result: SyncResult = {
    created: 0,
    updated: 0,
    closed: 0,
    renamed: 0,
    warnings: [],
  };
  
  // Phase 1: Handle Code YES, Doc NO, Issue NO - create docs
  const newDocs = [];
  for (const todo of todos) {
    if (!todoDocs.has(todo.id)) {
      const doc = await handleCodeYesDocNoIssueNo(todo, repo, ISSUES_DIR, result);
      if (doc) {
        newDocs.push(doc);
        todoDocs.set(todo.id, doc);
      }
    }
  }
  
  // Phase 2: Handle TODO docs state machine
  for (const [todoId, doc] of todoDocs) {
    const codeExists = todoIds.has(todoId);
    const issueExists = doc.number && issuesByNumber.has(doc.number);
    
    if (!codeExists && !issueExists) {
      // Code NO, Doc YES, Issue NO - keep doc (orphaned TODO doc)
      console.log(`TODO removed from code: ${doc.filename} - keeping doc`);
    } else if (!codeExists && issueExists) {
      // Code NO, Doc YES, Issue YES - sync
      const issue = issuesByNumber.get(doc.number!)!;
      await handleCodeNoDocYesIssueYes(doc, issue, repo, eventType, result);
    } else if (codeExists && !issueExists && !doc.number) {
      // Code YES, Doc YES, Issue NO (no number) - create issue
      await handleCodeYesDocYesIssueNo(doc, repo, ISSUES_DIR, result);
    } else if (codeExists && issueExists) {
      // Code YES, Doc YES, Issue YES - sync if changed
      const issue = issuesByNumber.get(doc.number!)!;
      await handleCodeYesDocYesIssueYes(doc, issue, repo, eventType, changedFiles, result);
    }
  }
  
  // Phase 3: Handle task docs without numbers - create issues
  for (const doc of docsWithoutNumber) {
    if (!doc.isTodoDoc) {
      await handleCodeNoDocYesIssueNo(doc, repo, ISSUES_DIR, result);
    }
  }
  
  // Phase 4: Handle task docs with numbers - sync if changed
  for (const [number, doc] of docsWithNumber) {
    if (doc.isTodoDoc) continue; // Already handled
    
    if (!issuesByNumber.has(number)) {
      console.log(`Task doc ${doc.filename} has number but no GitHub issue - skipping`);
      continue;
    }
    
    if (eventType === 'push' && changedFiles && changedFiles.includes(doc.file)) {
      const issue = issuesByNumber.get(number)!;
      await handleCodeNoDocYesIssueYes(doc, issue, repo, eventType, result);
    }
  }
  
  // Phase 5: Handle orphaned GitHub issues - Code NO, Doc NO, Issue YES
  for (const [number, issue] of issuesByNumber) {
    if (!docsWithNumber.has(number)) {
      await handleCodeNoDocNoIssueYes(issue, repo, result);
    }
  }
  
  // Commit and push changes
  if (await hasStagedChanges()) {
    await gitCommit('Sync issues: create docs and add issue numbers', true);
    await gitPush();
    console.log('\n✅ Changes committed and pushed');
  }
  
  // Summary
  console.log(`\nSync Summary:`);
  console.log(`  Issues created: ${result.created}`);
  console.log(`  Issues updated: ${result.updated}`);
  console.log(`  Issues closed: ${result.closed}`);
  console.log(`  Files renamed: ${result.renamed}`);
  
  if (result.warnings.length > 0) {
    console.log(`\nWarnings:`);
    result.warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
  }
  
  console.log('\n✅ Sync complete!');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
