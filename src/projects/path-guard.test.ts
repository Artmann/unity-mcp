import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import fs from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

import { PathOutsideProjectError, resolvePathInsideRoots } from './path-guard.js'

describe('resolvePathInsideRoots', () => {
  let workspace: string
  let projectRoot: string
  let siblingRoot: string
  let secretPath: string

  beforeAll(async () => {
    workspace = await fs.mkdtemp(join(tmpdir(), 'unity-mcp-'))
    projectRoot = join(workspace, 'MyProject')
    siblingRoot = join(workspace, 'MyProject-evil')
    secretPath = join(workspace, 'secret.txt')

    await fs.mkdir(join(projectRoot, 'Assets'), { recursive: true })
    await fs.mkdir(siblingRoot, { recursive: true })
    await fs.writeFile(
      join(projectRoot, 'Assets', 'Player.cs'),
      'class Player {}'
    )
    await fs.writeFile(join(siblingRoot, 'stolen.txt'), 'nope')
    await fs.writeFile(secretPath, 'top secret')
    await fs.symlink(
      workspace,
      join(projectRoot, 'Assets', 'escape'),
      'junction'
    )
  })

  afterAll(async () => {
    await fs.rm(workspace, { force: true, recursive: true })
  })

  it('allows files inside a project', async () => {
    const filePath = join(projectRoot, 'Assets', 'Player.cs')

    const result = await resolvePathInsideRoots(filePath, [projectRoot])

    expect(result).toBe(await fs.realpath(filePath))
  })

  it('rejects files outside every project', async () => {
    await expect(
      resolvePathInsideRoots(secretPath, [projectRoot])
    ).rejects.toBeInstanceOf(PathOutsideProjectError)
  })

  it('rejects traversal with .. segments', async () => {
    const filePath = join(projectRoot, 'Assets', '..', '..', 'secret.txt')

    await expect(
      resolvePathInsideRoots(filePath, [projectRoot])
    ).rejects.toBeInstanceOf(PathOutsideProjectError)
  })

  it('rejects sibling directories that share the project name prefix', async () => {
    const filePath = join(siblingRoot, 'stolen.txt')

    await expect(
      resolvePathInsideRoots(filePath, [projectRoot])
    ).rejects.toBeInstanceOf(PathOutsideProjectError)
  })

  it('rejects symlinks that point outside the project', async () => {
    const filePath = join(projectRoot, 'Assets', 'escape', 'secret.txt')

    await expect(
      resolvePathInsideRoots(filePath, [projectRoot])
    ).rejects.toBeInstanceOf(PathOutsideProjectError)
  })

  it('rejects the project root itself', async () => {
    await expect(
      resolvePathInsideRoots(projectRoot, [projectRoot])
    ).rejects.toBeInstanceOf(PathOutsideProjectError)
  })

  it('skips project roots that no longer exist', async () => {
    const filePath = join(projectRoot, 'Assets', 'Player.cs')

    const result = await resolvePathInsideRoots(filePath, [
      join(workspace, 'Deleted'),
      projectRoot
    ])

    expect(result).toBe(await fs.realpath(filePath))
  })
})
