import { ProjectService } from './project-service.js'

const projectService = new ProjectService()

const projects = await projectService.listProjects()

console.log(projects)

const files = await projectService.listFilesInProject(projects[0].title)

console.table(files)
