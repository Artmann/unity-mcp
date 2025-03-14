# Unity MCP Server

Model Context Protocol (MCP) server for Unity Hub integration. This server provides access to Unity project information through a standardized interface.

## Features

- List Unity projects from Unity Hub
- Integration with MCP Inspector for testing

## Installation

To install dependencies:

```bash
bun install
```

## Usage

To run the server:

```bash
bun run src/index.ts
```

To run with the MCP Inspector:

```bash
bun run inspector
```

## Development

This project uses Bun as its JavaScript runtime and TypeScript for type safety.

```bash
# Type check the project
bun run typecheck

# Format code
bun run format
```

## Requirements

- Unity Hub installed with projects configured
- Bun runtime

## License

MIT License - see [LICENSE](LICENSE) file for details.
