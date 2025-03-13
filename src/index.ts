import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  handleListProjects,
  listProjectsInputSchema
} from './projects/index.js'

const server = new McpServer({
  name: 'unity',
  version: '1.0.0'
})

// Use 'as any' as a temporary solution to get past the type issues
server.tool(
  'list_projects', 
  {},
  async (args: {}) => {
    return await handleListProjects(args);
  }
) as any

async function main() {
  const transport = new StdioServerTransport()

  await server.connect(transport)

  console.log('Unity MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)

  process.exit(1)
})
