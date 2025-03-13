# CLAUDE.md

- The MCP documentation can be found in `typescript-sdk.md`.
- Don't write comments unless it's to explain why a piece of code needs to be
  there.

## Build/Run Commands

- Install dependencies: `bun install`
- Run application: `bun run index.ts`
- Type check: `bun run typecheck` (alias for `tsc --noEmit`)
- Format code: `bun run format` (needs prettier to be installed)
- Test: `bun test` (write tests in \*.test.ts files)
- Test a single file: `bun test path/to/test.test.ts`

## Code Style Guidelines

- Use early exists instead of if/else.
- **Formatting**: Use consistent indentation (2 spaces)
- **Imports**: ESM format (import/export), sorted alphabetically
- **Types**:
  - Use TypeScript strict mode
  - Prefer explicit types over inferred when not obvious
  - Use interfaces for object shapes
- **Naming**:
  - Variables/functions: camelCase
  - Classes/interfaces: PascalCase
  - Constants: UPPER_SNAKE_CASE
- **Error Handling**: Use try/catch blocks with specific error types
- **Comments**: JSDoc for exported functions and complex logic
- **File Organization**: One component/module per file

## Environment

- Runtime: Bun (fast JavaScript/TypeScript runtime)
- Module system: ESM (not CommonJS)
- TypeScript with strict mode enabled
