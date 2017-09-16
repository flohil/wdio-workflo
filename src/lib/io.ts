import * as fs from 'fs'
import * as path from 'path'

const read = (dir: string): string[] =>
  fs.readdirSync(dir)
  .reduce(
    (files: string[], file: string) =>
    fs.statSync(path.join(dir, file)).isDirectory() ?
      files.concat(read(path.join(dir, file))) :
      files.concat(path.join(dir, file)),
    []
  )

export function getAllFiles(dirPath: string, extension: string) {
  return read(dirPath).filter(
    (fileName: string) => fileName.endsWith( extension )
  )
}