/**
 * File system utilities for reading and writing files safely
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, extname } from 'path';
import { existsSync } from 'fs';

/**
 * Check if a file is likely binary by reading first few bytes
 * Returns true if file appears to be binary
 */
export async function isBinaryFile(filePath: string): Promise<boolean> {
  try {
    const buffer = await readFile(filePath);
    
    // Check first 8000 bytes for null bytes (common in binary files)
    const chunkSize = Math.min(buffer.length, 8000);
    for (let i = 0; i < chunkSize; i++) {
      if (buffer[i] === 0) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // If we can't read it, assume it's binary
    return true;
  }
}

/**
 * Read a text file safely with proper error handling
 */
export async function readTextFile(filePath: string): Promise<string | null> {
  try {
    // Check if binary first
    if (await isBinaryFile(filePath)) {
      return null;
    }
    
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      if (nodeError.code === 'EISDIR') {
        return null; // Is a directory
      }
    }
    
    // Other errors (permission, etc.)
    console.warn(`Could not read file ${filePath}:`, error);
    return null;
  }
}

/**
 * Write a text file safely with proper error handling
 * Creates parent directories if needed
 */
export async function writeTextFile(
  filePath: string,
  content: string
): Promise<boolean> {
  try {
    // Ensure directory exists
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    
    await writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

/**
 * Get file extension (lowercase, without dot)
 */
export function getExtension(filePath: string): string {
  const ext = extname(filePath);
  return ext ? ext.slice(1).toLowerCase() : '';
}
