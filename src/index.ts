import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import {
  handleListFilesInProject,
  handleListProjects,
  handleReadFile
} from './projects/index.js'

const server = new McpServer(
  {
    name: 'unity',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
)

server.tool(
  'list_projects',
  'Lists all available Unity projects.',
  {},
  async (args: {}) => {
    return await handleListProjects(args)
  }
)

server.tool(
  'list_files_in_project',
  'Lists all the files inside a Unity project.',
  {
    projectName: z.string().nonempty()
  },
  async (args: any) => {
    return await handleListFilesInProject(args)
  }
)

server.tool(
  'read_file',
  'Reads the contents of a file inside a Unity project.',
  {
    path: z.string().nonempty()
  },
  async (args: any) => {
    return await handleReadFile(args)
  }
)

async function main() {
  const transport = new StdioServerTransport()

  await server.connect(transport)
}

main().catch((error) => {
  console.error('Fatal error in main():', error)

  process.exit(1)
})
