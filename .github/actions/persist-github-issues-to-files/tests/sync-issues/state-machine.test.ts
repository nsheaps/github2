import { describe, it, expect } from 'vitest';
import { determineAction, SyncState } from '@/sync-issues/state-machine';

describe('state-machine', () => {
  describe('determineAction', () => {
    it('should create issue when code=false, doc=true, issue=false', () => {
      const state: SyncState = {
        codeHasTODO: false,
        docExists: true,
        issueExists: false,
      };

      const action = determineAction(state);
      expect(action).toBe('create_issue');
    });

    it('should close issue when code=false, doc=false, issue=true', () => {
      const state: SyncState = {
        codeHasTODO: false,
        docExists: false,
        issueExists: true,
      };

      const action = determineAction(state);
      expect(action).toBe('close_issue');
    });

    it('should sync when code=false, doc=true, issue=true', () => {
      const state: SyncState = {
        codeHasTODO: false,
        docExists: true,
        issueExists: true,
      };

      const action = determineAction(state);
      expect(action).toBe('sync_doc_to_issue');
    });

    it('should create doc and issue when code=true, doc=false, issue=false', () => {
      const state: SyncState = {
        codeHasTODO: true,
        docExists: false,
        issueExists: false,
      };

      const action = determineAction(state);
      expect(action).toBe('create_doc_and_issue');
    });

    it('should create issue when code=true, doc=true, issue=false', () => {
      const state: SyncState = {
        codeHasTODO: true,
        docExists: true,
        issueExists: false,
      };

      const action = determineAction(state);
      expect(action).toBe('create_issue');
    });

    it('should sync when code=true, doc=true, issue=true', () => {
      const state: SyncState = {
        codeHasTODO: true,
        docExists: true,
        issueExists: true,
      };

      const action = determineAction(state);
      expect(action).toBe('sync_doc_to_issue');
    });

    it('should do nothing when code=false, doc=false, issue=false', () => {
      const state: SyncState = {
        codeHasTODO: false,
        docExists: false,
        issueExists: false,
      };

      const action = determineAction(state);
      expect(action).toBe('nothing');
    });

    it('should do nothing when code=true, doc=false, issue=true', () => {
      const state: SyncState = {
        codeHasTODO: true,
        docExists: false,
        issueExists: true,
      };

      const action = determineAction(state);
      expect(action).toBe('nothing');
    });
  });

  describe('State transitions', () => {
    it('should handle all 8 possible states', () => {
      const states: SyncState[] = [
        { codeHasTODO: false, docExists: false, issueExists: false }, // 000
        { codeHasTODO: false, docExists: false, issueExists: true },  // 001
        { codeHasTODO: false, docExists: true, issueExists: false },  // 010
        { codeHasTODO: false, docExists: true, issueExists: true },   // 011
        { codeHasTODO: true, docExists: false, issueExists: false },  // 100
        { codeHasTODO: true, docExists: false, issueExists: true },   // 101
        { codeHasTODO: true, docExists: true, issueExists: false },   // 110
        { codeHasTODO: true, docExists: true, issueExists: true },    // 111
      ];

      states.forEach(state => {
        const action = determineAction(state);
        expect(action).toBeTruthy();
      });
    });
  });
});
