import { describe, it, expect } from 'vitest';
import { parseFrontmatter, extractFrontmatter, serializeFrontmatter } from '@/common/yaml-frontmatter';

describe('yaml-frontmatter', () => {
  describe('extractFrontmatter', () => {
    it('should extract frontmatter from markdown with content', () => {
      const content = `---
title: Test Title
labels: [bug, feature]
---

## Body Content`;
      
      const result = extractFrontmatter(content);
      expect(result).toEqual({
        frontmatter: `title: Test Title
labels: [bug, feature]`,
        body: '## Body Content',
      });
    });

    it('should handle markdown without frontmatter', () => {
      const content = '## Just Body';
      const result = extractFrontmatter(content);
      expect(result).toEqual({
        frontmatter: '',
        body: '## Just Body',
      });
    });

    it('should handle empty content', () => {
      const result = extractFrontmatter('');
      expect(result).toEqual({
        frontmatter: '',
        body: '',
      });
    });

    it('should handle frontmatter with no body', () => {
      const content = `---
title: Test
---`;
      const result = extractFrontmatter(content);
      expect(result).toEqual({
        frontmatter: 'title: Test',
        body: '',
      });
    });
  });

  describe('parseFrontmatter', () => {
    it('should parse valid YAML frontmatter', () => {
      const yaml = `title: Test Title
labels: [bug, feature]
assignees: []`;
      
      const result = parseFrontmatter(yaml);
      expect(result).toEqual({
        title: 'Test Title',
        labels: ['bug', 'feature'],
        assignees: [],
      });
    });

    it('should handle title with colons', () => {
      const yaml = 'title: "TODO: Fix this bug"';
      const result = parseFrontmatter(yaml);
      expect(result).toEqual({
        title: 'TODO: Fix this bug',
      });
    });

    it('should handle multi-line values', () => {
      const yaml = `title: Test
description: |
  Line 1
  Line 2`;
      const result = parseFrontmatter(yaml);
      expect(result.description).toContain('Line 1');
      expect(result.description).toContain('Line 2');
    });

    it('should return empty object for invalid YAML', () => {
      const result = parseFrontmatter('invalid: yaml: content:');
      expect(result).toEqual({});
    });
  });

  describe('serializeFrontmatter', () => {
    it('should serialize object to YAML', () => {
      const data = {
        title: 'Test Title',
        labels: ['bug', 'feature'],
        assignees: [],
      };
      
      const result = serializeFrontmatter(data);
      expect(result).toContain('title: Test Title');
      expect(result).toContain('labels:');
      expect(result).toContain('- bug');
      expect(result).toContain('- feature');
    });

    it('should escape special characters', () => {
      const data = {
        title: 'TODO: Fix "quoted" bug',
      };
      
      const result = serializeFrontmatter(data);
      // Should be properly escaped by js-yaml
      expect(result).toBeTruthy();
      
      // Parse it back to verify
      const parsed = parseFrontmatter(result);
      expect(parsed.title).toBe('TODO: Fix "quoted" bug');
    });

    it('should handle empty object', () => {
      const result = serializeFrontmatter({});
      expect(result).toBe('{}\n');
    });
  });
});
