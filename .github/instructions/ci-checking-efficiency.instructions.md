# CI Status Checking - Efficiency Rules

## CRITICAL: Check Before Waiting

**NEVER blindly wait for CI to start or complete. ALWAYS check status first.**

### Correct Workflow for CI Checking

1. **First, get the current CI status:**
   ```
   - Use pull_request_read to get PR status
   - Use actions_list to get recent workflow runs
   - Check if workflows are: queued, in_progress, or completed
   ```

2. **Then decide what to do:**
   - **If completed:** Review results immediately (success/failure)
   - **If in_progress:** Check how long it's been running
     - If < 30s running: Wait 10s then check again
     - If > 30s running: Wait 20s then check again
     - If > 1min running: Wait 30s then check again
   - **If queued:** Wait 10s then check again
   - **If not started:** Wait 10s then check again

3. **Maximum wait strategy:**
   - Never wait more than 30s at a time
   - Give up after 5 checks if still not complete
   - For this repo, CI jobs are fast (< 2 minutes total)

### Anti-Patterns to AVOID

❌ **DON'T:** Blindly sleep/wait without checking status first
❌ **DON'T:** Wait after seeing workflows are already completed
❌ **DON'T:** Assume CI needs time - it might be done already
❌ **DON'T:** Wait 60s or other long periods - use incremental checking

### "WTF Dude" Trigger

When the user says "wtf dude" or similar expressions of frustration:

1. **STOP immediately** - You're doing something wrong
2. **Identify the inefficiency or mistake**
3. **Update rules** to prevent this specific mistake
4. **Fix the original problem** that triggered the frustration
5. **Document the lesson learned** in appropriate instructions file

## Examples

### ✅ CORRECT: Check then wait conditionally
```
1. Check PR status → See "in_progress"
2. Check workflow runs → See started 15s ago
3. Wait 10s (appropriate for recent start)
4. Check again → See "completed"
5. Review results
```

### ❌ WRONG: Blind waiting
```
1. Push commit
2. Wait 10s blindly
3. Wait 20s blindly
4. Check status → It was done 30s ago
```

## Implementation

Use GitHub MCP tools efficiently:
- `pull_request_read` - Get PR mergeable state and status checks
- `actions_list` with `list_workflow_runs` - See recent runs
- `get_job_logs` - Only when failures detected

Always check completion status before waiting.
