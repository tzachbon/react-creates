import fs from "fs";
import { join } from "path";
import { promisify } from "util";

const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const matchReg = (key: string) => new RegExp(`{%${key}%}`, "g");
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

export async function replacer<T>(str: string, key: string, value: T) {
  return str.replace(matchReg(key), String(value));
}

export async function renameFileName(path: string, vars: Variables) {
  for (const [key, value] of Object.entries(vars)) {
    if (path.match(matchReg(key))) {
      const newPath = await replacer(path, key, value);
      await rename(path, newPath);
      path = newPath;
    }
  }

  return path;
}

export async function replaceFileContent(path: string, vars: Variables) {
  let fileContent = await readFile(path, "utf8");

  for (const [key, value] of Object.entries(vars)) {
    if (fileContent.match(matchReg(key))) {
      const newFileContent = await replacer(fileContent, key, value);
      await writeFile(path, newFileContent);
      fileContent = newFileContent;
    }
  }
}
