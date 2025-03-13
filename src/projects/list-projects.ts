import { ProjectService } from './project-service.js'

const projects = await new ProjectService().listProjects()

console.log(projects)
