# Critical Behavior Rules for Copilot

## "WTF Dude" Trigger - CRITICAL INSTRUCTION

When the user says **"wtf dude"** (or similar frustration indicators), this is a CRITICAL SIGNAL that you are:
1. Doing something fundamentally wrong
2. Missing obvious information
3. Repeating a mistake unnecessarily

**Required Response:**
1. **STOP** what you're doing immediately
2. **Step back** and analyze what you just did wrong
3. **Update rules/instructions** to prevent this specific mistake from happening again
4. **Fix the actual issue** that triggered the response
5. **Document the mistake** in these instructions as a lesson learned

This trigger applies to ANY action, not just CI checks - it's a general signal that you need to reassess your approach.

## Repetitive Action Detection

**Rule**: If you perform the same tool call or sequence of tool calls more than **5 times in a row**, you MUST:

1. **STOP** the repetitive behavior immediately
2. **Analyze** why the repeated action isn't achieving the desired result
3. **Reassess** your approach and identify the correct way to proceed
4. **Update instructions** with the behavior correction
5. **Proceed** with the corrected approach

**Examples of repetitive patterns to watch for:**
- Calling the same API endpoint repeatedly expecting different results
- Waiting for something that's already completed
- Retrying failed operations without changing the approach
- Reading the same file multiple times without making changes

## CI Status Checking - Specific Rules

**CRITICAL:** Checking CI status always comes AFTER these tasks (in priority order):

- Investigating and planning your task at hand
- Making changes related to your task
- Committing and pushing those changes -- your session might die at any time
- Reviewing your changes with a critical, staff engineering level mindset (consider the behaviors staff engineers exhibit and the things they look for in a review)
- Addressing any self-feedback from the review, committing and pushing those
- Validating your changes, both manually and with test automation (which should also run in CI)
- Fixing anything found from validation, pushing those as well
- ...
- Making sure what you thing CI will test actually passes locally
- ONLY THEN should you check CI status.

**NEVER blindly wait for CI to start or complete.** Always check status first.

**Correct CI checking workflow:**
1. **Check current status** using GitHub MCP tools (pull_request_read, list_workflow_runs)
2. **Evaluate the state**:
   - If CI hasn't started yet → wait briefly (10s) then check again
   - If CI is running → check progress, then wait appropriately (20-30s) before next check
   - If CI is completed → analyze results immediately, DO NOT wait
   - If CI failed → get logs and analyze, DO NOT wait
3. **Never wait more than 30s** between checks
4. **Never wait if status shows completion** - analyze results immediately

**Progressive waiting pattern (if CI is not complete):**
- First check: immediate
- Second check: wait 10s
- Third check: wait 20s  
- Fourth+ checks: wait 30s
- After 5 checks: reassess whether to continue waiting

**Common mistakes to avoid:**
- ❌ Waiting 10s before first check when CI might already be done
- ❌ Waiting after seeing "completed" status
- ❌ Repeatedly checking without analyzing results
- ❌ Ignoring workflow run timestamps (if completed 5 minutes ago, don't wait!)

## Information Gathering - Use Available Data

**Before taking action, check what information you already have:**

1. **Review recent tool outputs** - you may already have the data you need
2. **Check timestamps** - if something completed in the past, don't wait for it
3. **Read error messages carefully** - they often tell you exactly what's wrong
4. **Use parallel tool calls** - when gathering independent information
5. **Don't repeat queries** - if you already got the data, use it

## Lessons Learned

### Lesson 1: CI Status Blindness (2026-01-10)
**Mistake**: Called list_workflows, then waited 10s for CI that was already finished
**Root cause**: Didn't check the workflow run status or timestamps before waiting
**Fix**: Always evaluate workflow_runs data to see if CI is complete before waiting
**Prevention**: Check completion_date, status, conclusion fields in workflow run data

### Lesson 2: Ignoring Workflow Run Results (2026-01-10)
**Mistake**: Got workflow runs with list_workflow_runs, then blindly waited without reading the status
**Root cause**: Didn't parse the response to check if workflows were already completed
**Fix**: Always read and analyze the workflow run data - check status, conclusion, and completed_at fields
**Prevention**: 
- If conclusion="success" and status="completed" → CI passed, move on
- If conclusion="failure" and status="completed" → CI failed, get logs
- If status="in_progress" → CI running, intelligent wait if needed
- If status="queued" → CI not started, brief wait then recheck

