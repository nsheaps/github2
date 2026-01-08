#!/usr/bin/env node
/**
 * Main entry point for TODO scanning
 * Scans codebase for TODO comments and creates/updates documentation
 */

import { scanAllTodos } from './scanner.js';
import {
  generateTodoDoc,
  checkTodoDoc,
  saveTodoDoc,
} from './doc-generator.js';
import { gitAdd, gitCommit, hasStagedChanges } from '../common/git-utils.js';

const ISSUES_DIR = '.github/issues';

async function main() {
  console.log('=== TODO Scanner ===\n');
  
  // Scan for TODOs
  const todos = await scanAllTodos();
  
  if (todos.length === 0) {
    console.log('✅ No TODOs found in codebase');
    return;
  }
  
  console.log(`\nProcessing ${todos.length} TODOs...\n`);
  
  let created = 0;
  let updated = 0;
  let unchanged = 0;
  
  for (const todo of todos) {
    const { filename, content } = generateTodoDoc(todo);
    const existing = await checkTodoDoc(ISSUES_DIR, todo.id);
    
    if (!existing.exists) {
      // Create new doc
      const filePath = await saveTodoDoc(ISSUES_DIR, filename, content);
      await gitAdd(filePath);
      console.log(`✓ Created: ${filename}`);
      created++;
    } else if (existing.content !== content) {
      // Update existing doc
      await saveTodoDoc(ISSUES_DIR, filename, content);
      await gitAdd(existing.file!);
      console.log(`✓ Updated: ${filename}`);
      updated++;
    } else {
      unchanged++;
    }
  }
  
  // Commit if there are changes
  if (await hasStagedChanges()) {
    const message = `Sync TODOs from code: ${created} created, ${updated} updated`;
    await gitCommit(message, false);
    console.log(`\n✅ ${message}`);
  } else {
    console.log('\n✅ All TODOs are already synced');
  }
  
  // Summary
  console.log(`\nSummary:`);
  console.log(`  TODOs in code: ${todos.length}`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Unchanged: ${unchanged}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
