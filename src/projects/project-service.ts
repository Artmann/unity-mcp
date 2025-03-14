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
  async listFilesInProject(projectTitle: string): Promise<string[]> {
    const projectList = await this.listProjects()
    const project = projectList.find((p) => p.title === projectTitle)

    if (!project) {
      throw new Error(`Project with title ${projectTitle} not found`)
    }

    const files = await this.listFilesInDirectoryRecursively(project.path)

    return files
  }

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

  private async listFilesInDirectoryRecursively(
    directoryPath: string
  ): Promise<string[]> {
    const files = await fs.readdir(directoryPath)

    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        const fullPath = join(directoryPath, file)
        const stats = await fs.stat(fullPath)

        return { fileName: file, fullPath, stats }
      })
    )

    const filesInDirectory = filesWithStats.filter(
      (file) =>
        file.stats.isFile() &&
        !file.fileName.startsWith('.') &&
        !file.fileName.endsWith('.meta') &&
        !file.fileName.startsWith('Lightmap')
    )

    const directories = filesWithStats.filter((file) =>
      file.stats.isDirectory()
    )

    const ignoredDirectories = ['Library', 'Temp', 'obj', 'bin', '.git']

    const filteredDirectories = directories.filter(
      (directory) => !ignoredDirectories.includes(directory.fileName)
    )
    const filesInSubdirectories = await Promise.all(
      filteredDirectories.map((directory) =>
        this.listFilesInDirectoryRecursively(directory.fullPath)
      )
    )

    return [
      ...filesInDirectory.map((file) => file.fullPath),
      ...filesInSubdirectories.flat()
    ]
  }
}
