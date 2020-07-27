import fs from "fs";
import { join } from "path";
import { promisify } from "util";
import { render } from "mustache";

const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const isDir = async (path) =>
  (await exists(path)) && (await lstat(path)).isDirectory();

export interface Variables {
  [key: string]: string | boolean;
}

export const replaceVariables = async (dir: string, vars: Variables) => {
  const files = await readdir(dir);

  for (const file of files) {
    let path = join(dir, file);
    path = await renameFileName(path, vars);

    if (await isDir(file)) {
      replaceVariables(path, vars);
    } else {
      replaceFileContent(path, vars);
    }
  }
};


export async function renameFileName(path: string, vars: Variables) {
  const newPath = render(path, vars);
  await rename(path, newPath);
  return newPath;
}

export async function replaceFileContent(path: string, vars: Variables) {
  const fileContent = await readFile(path, "utf8");
  const newFileContent = render(fileContent, vars);
  await writeFile(path, newFileContent);
}
