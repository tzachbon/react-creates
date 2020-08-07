import fs from "fs";
import { join, sep } from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir)

export type PackageJsonType = Record<string, IPackageJson | string | number | boolean>

interface IPackageJson extends PackageJsonType { };

export default async function getPackageJson(
  {
    cwd = process.cwd()
  } = {
      cwd: process.cwd()
    }
): Promise<PackageJsonType | null> {

  const directories = cwd.split(sep);
  const PACKAGE_JSON = `package.json`;

  while (directories.length) {
    const directory = directories.pop()
    const path = join(sep, ...directories, directory)
    const dirFiles = await readdir(path)

    if (dirFiles.includes(PACKAGE_JSON)) {
      const packageJson = require(join(path, PACKAGE_JSON)) as PackageJsonType | null;

      if (!packageJson) {
        continue;
      }

      return packageJson;
    }
  }

  return null;
}

