import fs from "fs";
import { join, sep } from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir)
const exists = promisify(fs.exists)

export type PackageJsonType = Record<string, IPackageJson | string | number | boolean>

interface IPackageJson extends PackageJsonType { };

export default async function getPackageJson(
  {
    cwd = process.cwd(),
    depth = 10
  }
): Promise<PackageJsonType | null> {

  const directories = cwd.split(sep);
  const PACKAGE_JSON = `package.json`;

  let iterations = 0;

  while (directories.length && iterations < depth) {

    iterations++;

    const directory = directories.pop()
    const path = join(sep, ...directories, directory)

    if (!(await exists(path))) continue;

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

