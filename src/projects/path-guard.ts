import fs from 'fs/promises'
import { isAbsolute, relative, sep } from 'path'

export class PathOutsideProjectError extends Error {
  constructor(requestedPath: string) {
    super(`The path ${requestedPath} is not inside a Unity project.`)
    this.name = 'PathOutsideProjectError'
  }
}

/**
 * Resolves a path to its canonical location and ensures it lives inside one
 * of the given root directories. Symlinks are resolved on both sides so a link
 * inside a project can't point at files outside of it.
 */
export async function resolvePathInsideRoots(
  requestedPath: string,
  roots: string[]
): Promise<string> {
  const realPath = await fs.realpath(requestedPath)

  for (const root of roots) {
    const realRoot = await realpathOrNull(root)

    if (!realRoot) {
      continue
    }

    if (isInside(realRoot, realPath)) {
      return realPath
    }
  }

  throw new PathOutsideProjectError(requestedPath)
}

function isInside(root: string, path: string): boolean {
  const relativePath = relative(root, path)

  if (relativePath === '') {
    return false
  }

  return (
    relativePath !== '..' &&
    !relativePath.startsWith(`..${sep}`) &&
    !isAbsolute(relativePath)
  )
}

async function realpathOrNull(path: string): Promise<string | null> {
  try {
    return await fs.realpath(path)
  } catch {
    return null
  }
}
