import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { isBinaryFile, readFileContent, writeFileContent, fileExists } from '@/common/file-utils';
import { tmpdir } from 'os';

describe('file-utils', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('isBinaryFile', () => {
    it('should detect text files as non-binary', async () => {
      const textFile = join(tempDir, 'test.txt');
      await fs.writeFile(textFile, 'Hello World');
      
      const result = await isBinaryFile(textFile);
      expect(result).toBe(false);
    });

    it('should detect binary files by null bytes', async () => {
      const binaryFile = join(tempDir, 'test.bin');
      const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      await fs.writeFile(binaryFile, buffer);
      
      const result = await isBinaryFile(binaryFile);
      expect(result).toBe(true);
    });

    it('should handle non-existent files', async () => {
      const result = await isBinaryFile(join(tempDir, 'nonexistent.txt'));
      expect(result).toBe(false);
    });

    it('should detect TypeScript files as non-binary', async () => {
      const tsFile = join(tempDir, 'test.ts');
      await fs.writeFile(tsFile, 'const x: string = "test";');
      
      const result = await isBinaryFile(tsFile);
      expect(result).toBe(false);
    });
  });

  describe('readFileContent', () => {
    it('should read UTF-8 file content', async () => {
      const file = join(tempDir, 'test.txt');
      await fs.writeFile(file, 'Hello World');
      
      const content = await readFileContent(file);
      expect(content).toBe('Hello World');
    });

    it('should throw error for non-existent file', async () => {
      await expect(readFileContent(join(tempDir, 'nonexistent.txt')))
        .rejects
        .toThrow();
    });

    it('should handle empty files', async () => {
      const file = join(tempDir, 'empty.txt');
      await fs.writeFile(file, '');
      
      const content = await readFileContent(file);
      expect(content).toBe('');
    });

    it('should handle files with special characters', async () => {
      const file = join(tempDir, 'special.txt');
      const specialContent = 'Line 1\nLine 2\n\tTabbed\n"Quoted"';
      await fs.writeFile(file, specialContent);
      
      const content = await readFileContent(file);
      expect(content).toBe(specialContent);
    });
  });

  describe('writeFileContent', () => {
    it('should write content to file', async () => {
      const file = join(tempDir, 'output.txt');
      await writeFileContent(file, 'Test Content');
      
      const content = await fs.readFile(file, 'utf-8');
      expect(content).toBe('Test Content');
    });

    it('should create parent directories if they do not exist', async () => {
      const file = join(tempDir, 'subdir', 'deep', 'output.txt');
      await writeFileContent(file, 'Nested Content');
      
      const content = await fs.readFile(file, 'utf-8');
      expect(content).toBe('Nested Content');
    });

    it('should overwrite existing file', async () => {
      const file = join(tempDir, 'overwrite.txt');
      await fs.writeFile(file, 'Original');
      
      await writeFileContent(file, 'Updated');
      
      const content = await fs.readFile(file, 'utf-8');
      expect(content).toBe('Updated');
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const file = join(tempDir, 'exists.txt');
      await fs.writeFile(file, 'content');
      
      const exists = await fileExists(file);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const exists = await fileExists(join(tempDir, 'nonexistent.txt'));
      expect(exists).toBe(false);
    });

    it('should return true for directories', async () => {
      const exists = await fileExists(tempDir);
      expect(exists).toBe(true);
    });
  });
});
