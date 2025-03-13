import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'

interface Project {
  id: string
  name: string
}

// Dummy projects data
const projects: Project[] = [
  { id: 'p1', name: 'Adventure Game' },
  { id: 'p2', name: 'FPS Template' },
  { id: 'p3', name: 'Mobile Puzzle' },
  { id: 'p4', name: 'VR Experience' },
  { id: 'p5', name: 'Racing Simulator' }
]

const server = new McpServer({
  name: 'unity',
  version: '1.0.0'
})

// Define projects resource
server.resource('projects', 'projects://list', async (uri) => ({
  contents: [
    {
      uri: uri.href,
      text: JSON.stringify(projects, null, 2)
    }
  ]
}))

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.log('Unity MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
