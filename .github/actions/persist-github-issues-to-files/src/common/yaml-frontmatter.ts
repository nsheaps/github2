/**
 * YAML frontmatter parsing and generation utilities
 * Uses js-yaml for proper YAML handling
 */

import yaml from 'js-yaml';

export interface Frontmatter {
  title?: string;
  labels?: string[];
  assignees?: string[];
  [key: string]: unknown;
}

export interface ParsedContent {
  frontmatter: Frontmatter;
  body: string;
}

/**
 * Parse YAML frontmatter from markdown content
 * Handles multi-line values, quoted strings, and special characters correctly
 */
export function parseFrontmatter(content: string): ParsedContent {
  const match = content.match(/^---\n(.*?)\n---\n(.*)$/s);
  
  if (!match) {
    return { frontmatter: {}, body: content.trim() };
  }
  
  const [, frontmatterText, body] = match;
  
  try {
    const frontmatter = yaml.load(frontmatterText) as Frontmatter;
    return {
      frontmatter: frontmatter || {},
      body: body.trim(),
    };
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error);
    return { frontmatter: {}, body: content.trim() };
  }
}

/**
 * Create YAML frontmatter from data
 * Properly escapes special characters
 */
export function createFrontmatter(data: Frontmatter): string {
  const yamlString = yaml.dump(data, {
    lineWidth: -1, // Don't wrap lines
    noCompatMode: true,
    quotingType: '"',
    forceQuotes: false,
  });
  
  return `---\n${yamlString.trim()}\n---`;
}

/**
 * Generate complete markdown document with frontmatter
 */
export function createMarkdownWithFrontmatter(
  frontmatter: Frontmatter,
  body: string
): string {
  return `${createFrontmatter(frontmatter)}\n\n${body.trim()}\n`;
}

/**
 * Alias for createMarkdownWithFrontmatter (for test compatibility)
 */
export const serializeFrontmatter = createMarkdownWithFrontmatter;
