import fs from 'fs/promises'
import { z } from 'zod'

import { ProjectService } from './project-service.js'

type ZodObjectParams<T> = z.ZodObject<{ [key in keyof T]: z.ZodType<T[key]> }>

export interface ListProjectsParams {}

export const listProjectsInputSchema = z.object(
  {}
) satisfies ZodObjectParams<ListProjectsParams>

export async function handleListProjects({}: ListProjectsParams) {
  try {
    const projectService = new ProjectService()
    const projects = await projectService.listProjects()

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(projects, null, 2)
        }
      ]
    }
  } catch (error) {
    console.error('Error handling list projects request:', error)

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            { error: 'Failed to list Unity projects' },
            null,
            2
          )
        }
      ],
      isError: true
    }
  }
}

export const listFilesInProjectSchema = z.object({
  projectName: z.string()
})

export type ListFilesInProjectParams = z.infer<typeof listFilesInProjectSchema>

export async function handleListFilesInProject({
  projectName
}: ListFilesInProjectParams) {
  try {
    const projectService = new ProjectService()
    const files = await projectService.listFilesInProject(projectName)

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(files, null, 2)
        }
      ]
    }
  } catch (error) {
    console.error('Error handling list files request:', error)

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            { error: 'Failed to list files in the Unity project.' },
            null,
            2
          )
        }
      ],
      isError: true
    }
  }
}

export async function handleReadFile({ path }: { path: string }) {
  try {
    const data = await fs.readFile(path, 'utf-8')

    return {
      content: [
        {
          type: 'text' as const,
          text: data
        }
      ]
    }
  } catch (error) {
    console.error('Error reading file:', error)

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            { error: `Failed to read file at ${path}.` },
            null,
            2
          )
        }
      ],
      isError: true
    }
  }
}
