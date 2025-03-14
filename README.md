# Unity MCP Server

MCP server to connect Claude with Unity projects. Built using the
[Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk).

## Features

- List all Unity projects
- Get detailed project information
- Access project structure and files

## Installation & Usage

### Option 1: Using NPX (Recommended)

You can run this tool directly with npx without installing it:

```bash
npx unity-mcp@latest
```

Add this tool as an MCP server in Claude:

On MacOS: `~/Library/Application\ Support/Claude/claude_desktop_config.json`  
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "unity": {
      "command": "npx",
      "args": ["unity-mcp@latest"]
    }
  }
}
```

### Option 2: Run this project locally

Alternatively, run this project locally by cloning this repo:

```bash
git clone https://github.com/your-username/unity-mcp.git
cd unity-mcp
bun install
```

Then configure Claude to use your local version:

```json
{
  "mcpServers": {
    "unity": {
      "command": "bun",
      "args": ["run", "C:\\Users\\Artga\\Code\\unity-mcp\\src\\index.ts"]
    }
  }
}
```

### Requirements

- Unity with projects configured
- Bun runtime

### Troubleshooting

Please open an issue if you can't get this MCP working. Here are some tips:

1. Make sure Unity is installed and you have some projects configured
2. Check that the unity-mcp server can access the projects-v1.json file
3. Ensure you have proper permissions for the Unity project directories

This MCP will emit logs to stderr as specified in the MCP spec. On Mac the
Claude Desktop app should emit these logs to `~/Library/Logs/Claude`. On other
platforms
[you can find logs here](https://modelcontextprotocol.io/quickstart/user#getting-logs-from-claude-for-desktop).

## Development

### Setup

```bash
# Install dependencies
bun install

# Run the project
bun run src/index.ts

# Type check
bun run typecheck

# Format code
bun run format
```

### Debugging

Since MCP servers run over stdio, debugging can be challenging. For the best
debugging experience, we strongly recommend using the
[MCP Inspector](https://github.com/modelcontextprotocol/inspector).

You can launch the MCP Inspector with this command:

```bash
bun run inspector
```

Upon launching, the Inspector will display a URL that you can access in your
browser to begin debugging.

## License

MIT License - see [LICENSE](LICENSE) file for details.
