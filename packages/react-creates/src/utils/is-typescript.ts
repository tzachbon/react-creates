import fs from 'fs';
import { join, sep } from 'path';
import { promisify } from 'util';
import getPackageJson from './get-package-json';

const lstat = promisify(fs.lstat);
const exists = promisify(fs.exists);
const isFile = async (path: string) => (await exists(path)) && (await lstat(path)).isFile();

const isInsideTypescript = async (target: string) => {
  const directories = target.split(sep);
  const TSCONFIG = `tsconfig.json`;

  while (directories.length) {
    const directory = directories.pop();
    const currentPath = join(...directories, directory);
    const tsconfigPath = join(currentPath, TSCONFIG);

    const tsconfigExists = await isFile(tsconfigPath);

    const { devDependencies, dependencies } = (await getPackageJson({ cwd: currentPath })) || {};
    const haveTsInDependencies = devDependencies?.['typescript'] || dependencies?.['typescript'];

    if (tsconfigExists && haveTsInDependencies) {
      return true;
    }
  }

  return false;
};

export default async function isTypescript(target = process.cwd()): Promise<boolean> {
  return await isInsideTypescript(target);
}
