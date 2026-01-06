# AI Tool Configuration and Usage

## Overview

This document describes the AI-powered development tools used in the GitHub2 project and how to configure them.

## Tools

### GitHub Copilot

**Purpose**: Code completion and generation

**Integration**: VS Code, JetBrains IDEs, Neovim, etc.

**Configuration**: See IDE-specific setup

**Usage**:
- Accept suggestions with Tab
- Cycle through suggestions with Alt+] / Alt+[
- Invoke inline chat with Cmd+I / Ctrl+I
- Open chat panel for longer conversations

**Best Practices**:
- Write clear comments to guide Copilot
- Review all suggestions before accepting
- Use for boilerplate, not complex logic
- Don't blindly trust generated code

### Claude Code (Anthropic)

**Purpose**: Larger refactoring, architectural decisions, code review

**Configuration**: 

Create a `.claude.json` or `claude.md` in the project root (not committed):

```json
{
  "version": "1.0",
  "context": {
    "codebase": "GitHub2 - Modern GitHub UI Client",
    "language": "TypeScript",
    "framework": "React 19 + Vite",
    "testing": "Vitest + React Testing Library"
  },
  "preferences": {
    "codeStyle": "Prettier + ESLint rules",
    "imports": "Use named imports, group by type",
    "async": "Use async/await over promises",
    "components": "Functional components with hooks only"
  }
}
```

**Usage**:
- Provide full context in prompts
- Ask for explanations, not just code
- Use for architectural decisions
- Review generated code carefully

### AGENTS.md

**Purpose**: Define custom AI agents for specific tasks

**Location**: `.github/agents/AGENTS.md` (if supported by platform)

**Structure**:

```markdown
# GitHub2 Project Agents

## Code Review Agent

**Trigger**: On pull request
**Scope**: All TypeScript/React files
**Rules**:
- Check for proper TypeScript types
- Verify React hooks dependencies
- Ensure tests exist for new features
- Check for security vulnerabilities

## Documentation Agent

**Trigger**: On changes to docs/
**Scope**: Markdown files
**Rules**:
- Verify links are valid
- Check code examples compile
- Ensure diagrams are up to date
- Validate structure follows template

## Refactoring Agent

**Trigger**: Manual invocation
**Scope**: Specified files
**Rules**:
- Maintain existing behavior
- Improve code clarity
- Add missing types
- Extract complex logic to functions
```

## Configuration Files

### Claude Code Config (claude.md)

Place in project root (not version controlled):

```markdown
# GitHub2 Project Context

## Overview
GitHub2 is a modern, performant alternative GitHub UI built with React and TypeScript.

## Code Conventions
- Use TypeScript strict mode
- Functional React components only
- Custom hooks for reusable logic
- Services for API calls
- Follow existing file structure

## Testing
- Write tests for all new features
- Use React Testing Library best practices
- Mock external APIs
- Aim for 80%+ coverage

## Architecture
- Client-side only (SPA)
- Direct GitHub API integration
- WebWorker for background sync
- IndexedDB for offline storage

## Naming Conventions
- PascalCase for components
- camelCase for functions/variables
- kebab-case for file names (except components)
- Descriptive names over short names

## Import Organization
1. React and external libraries
2. Internal components
3. Hooks
4. Services
5. Types
6. Styles

## State Management
- React hooks (useState, useEffect, etc.)
- Context for global state
- Custom hooks for complex state logic

## Error Handling
- Try/catch for async operations
- User-friendly error messages
- Log errors for debugging
- Graceful degradation

## Performance
- Lazy load routes
- Memoize expensive computations
- Virtualize long lists
- Debounce/throttle user inputs
```

### Example .vscode/settings.json

For consistent AI-assisted development:

```json
{
  "github.copilot.enable": {
    "*": true,
    "typescript": true,
    "typescriptreact": true,
    "markdown": true
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "github.copilot.editor.enableCodeActions": true,
  "files.associations": {
    "*.claude.md": "markdown",
    "AGENTS.md": "markdown"
  }
}
```

## Best Practices

### When to Use AI Tools

**Good Uses**:
- Boilerplate code generation
- Test scaffolding
- Documentation writing
- Refactoring suggestions
- Bug investigation
- Code explanations

**Bad Uses**:
- Critical security code
- Complex algorithms without review
- Anything you don't understand
- Production secrets/credentials
- Copy-paste without reading

### Prompt Engineering

**For Copilot**:
```typescript
// Create a custom hook that fetches user data from GitHub API
// Should handle loading, error, and success states
// Should accept a username parameter
// Should debounce requests to avoid rate limiting
export function useGitHubUser(username: string) {
  // Copilot will generate the implementation
}
```

**For Claude**:
```
Context: Working on the GitHub2 project, specifically the rate limit viewer.

Task: Refactor the RateLimitChart component to support multiple APIs (core, search, graphql) with a tabbed interface.

Requirements:
- Maintain existing functionality
- Add tabs for each API type
- Share chart configuration
- Update tests

Current code: [paste code]
```

### Code Review with AI

1. **Self Review First**: Read the code yourself
2. **Ask Specific Questions**: "Does this handle edge case X?"
3. **Request Security Check**: "Any security issues?"
4. **Check Best Practices**: "Does this follow React best practices?"
5. **Final Human Review**: You make the final decision

### Security Considerations

**Never**:
- Commit AI config files with secrets
- Share tokens/credentials in prompts
- Trust AI for security-critical code
- Deploy AI-generated code without review

**Always**:
- Review generated code carefully
- Test thoroughly
- Use .gitignore for config files
- Audit for vulnerabilities

## Troubleshooting

### Copilot Not Working

1. Check authentication: Sign in to GitHub in IDE
2. Check network: Ensure internet connection
3. Check settings: Verify Copilot is enabled
4. Restart IDE

### Poor Suggestions

1. Add more context in comments
2. Provide examples in the file
3. Check if file is too large (split it)
4. Verify language is set correctly

### AI Config Not Loading

1. Verify file name and location
2. Check JSON syntax (if applicable)
3. Restart IDE or tool
4. Check tool documentation

## Future Enhancements

- [ ] Add Codeium support (open source alternative)
- [ ] Configure Continue.dev for local LLMs
- [ ] Add custom Copilot instructions
- [ ] Create project-specific AI prompts library
- [ ] Add AI-powered code review automation

## Resources

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Claude API Docs](https://docs.anthropic.com/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
