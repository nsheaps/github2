import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { scanTODOsInFile, scanTODOsInDirectory } from '@/scan-todos/scanner';
import { tmpdir } from 'os';

describe('scanner', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `test-scanner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('scanTODOsInFile', () => {
    it('should find TODO comments in JavaScript file', async () => {
      const file = join(tempDir, 'test.js');
      await fs.writeFile(file, `
// TODO: Implement feature X
function test() {
  // TODO: Add validation
  return true;
}
      `);

      const todos = await scanTODOsInFile(file);
      expect(todos).toHaveLength(2);
      expect(todos[0].text).toContain('Implement feature X');
      expect(todos[1].text).toContain('Add validation');
    });

    it('should find TODO comments in TypeScript file', async () => {
      const file = join(tempDir, 'test.ts');
      await fs.writeFile(file, `
// TODO: Fix type errors
const x: string = "test";
/* TODO: Refactor this */
      `);

      const todos = await scanTODOsInFile(file);
      expect(todos).toHaveLength(2);
      expect(todos[0].text).toContain('Fix type errors');
      expect(todos[1].text).toContain('Refactor this');
    });

    it('should find TODO comments in Python file', async () => {
      const file = join(tempDir, 'test.py');
      await fs.writeFile(file, `
# TODO: Add error handling
def test():
    # TODO: Optimize algorithm
    pass
      `);

      const todos = await scanTODOsInFile(file);
      expect(todos).toHaveLength(2);
    });

    it('should handle files with no TODOs', async () => {
      const file = join(tempDir, 'empty.js');
      await fs.writeFile(file, `
function test() {
  return true;
}
      `);

      const todos = await scanTODOsInFile(file);
      expect(todos).toHaveLength(0);
    });

    it('should include file path and line number', async () => {
      const file = join(tempDir, 'test.js');
      await fs.writeFile(file, `
// Line 1
// TODO: Test TODO
      `);

      const todos = await scanTODOsInFile(file);
      expect(todos[0].file).toBe(file);
      expect(todos[0].line).toBe(3);
    });

    it('should skip binary files', async () => {
      const file = join(tempDir, 'test.bin');
      const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      await fs.writeFile(file, buffer);

      const todos = await scanTODOsInFile(file);
      expect(todos).toHaveLength(0);
    });
  });

  describe('scanTODOsInDirectory', () => {
    it('should scan multiple files recursively', async () => {
      await fs.mkdir(join(tempDir, 'subdir'));
      
      await fs.writeFile(join(tempDir, 'file1.js'), '// TODO: File 1');
      await fs.writeFile(join(tempDir, 'subdir', 'file2.ts'), '// TODO: File 2');

      const todos = await scanTODOsInDirectory(tempDir);
      expect(todos.length).toBeGreaterThanOrEqual(2);
    });

    it('should ignore node_modules', async () => {
      await fs.mkdir(join(tempDir, 'node_modules'));
      await fs.writeFile(join(tempDir, 'node_modules', 'dep.js'), '// TODO: Should be ignored');
      await fs.writeFile(join(tempDir, 'app.js'), '// TODO: Should be found');

      const todos = await scanTODOsInDirectory(tempDir);
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toContain('Should be found');
    });

    it('should ignore .git directory', async () => {
      await fs.mkdir(join(tempDir, '.git'));
      await fs.writeFile(join(tempDir, '.git', 'config'), '# TODO: Ignored');
      await fs.writeFile(join(tempDir, 'app.js'), '// TODO: Found');

      const todos = await scanTODOsInDirectory(tempDir);
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toContain('Found');
    });

    it('should handle empty directories', async () => {
      const todos = await scanTODOsInDirectory(tempDir);
      expect(todos).toHaveLength(0);
    });
  });
});
