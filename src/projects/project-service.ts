import fs from 'fs/promises'
import { homedir } from 'os'
import { join, resolve } from 'path'

export interface Project {
  architecture: string
  changeset: string
  cloudEnabled: boolean
  cloudProjectId: string
  containingFolderPath: string
  isCustomEditor: boolean
  isFavorite: boolean
  lastModified: number
  localProjectId: string
  organizationId: string
  path: string
  projectName: string
  title: string
  version: string
}

export class ProjectService {
  async listProjects(): Promise<Project[]> {
    const projectListFilePath = this.getUnityProjectsFilePath()

    const json = await fs.readFile(projectListFilePath, 'utf-8')
    const projectList = JSON.parse(json)

    return Object.values(projectList.data).filter(
      (project: any) => project.title && project.path
    ) as Project[]
  }

  private getUnityProjectsFilePath(): string {
    const unityHubDirectoryPath = this.getUnityHubDirectoryPath()

    return join(unityHubDirectoryPath, 'projects-v1.json')
  }

  private getUnityHubDirectoryPath(): string {
    if (process.platform === 'win32') {
      return resolve(homedir(), 'AppData', 'Roaming', 'UnityHub')
    }

    if (process.platform === 'darwin') {
      return resolve(
        homedir(),
        'Library',
        'Application Support',
        'Unity',
        'Hub'
      )
    }

    return resolve(homedir(), '.config', 'UnityHub')
  }
}
