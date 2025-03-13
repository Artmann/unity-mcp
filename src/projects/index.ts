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
