import fs from "fs";
import { join, sep } from "path";
import { promisify } from "util";

const exists = promisify(fs.exists);

const isInsideTypescript = async (target: string) => {
  let currentPath = target;
  let itr = 0;
  let found = false;

  const MAX_ITERATIONS = +process.env.MAX_TYPESCRIPT_ITERATIONS || 10;

  while (itr < MAX_ITERATIONS && !found) {
    if (await exists(currentPath)) {

      if (await exists(join(currentPath, "tsconfig.json"))) {
        found = true;
      } else {
        const currentPathArray = currentPath.split(sep);
        currentPath = currentPathArray.slice(0, currentPathArray.length - 1).join(sep);
      }
    } else {
      itr = MAX_ITERATIONS;
    }
  }

  return found;
};

export default async function isTypescript(target = process.cwd()) {
  return await isInsideTypescript(target);
}
