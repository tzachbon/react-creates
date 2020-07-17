import fs from "fs";
import { join } from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);

export const parseTarget = async ({ name, target }) => {
  if (typeof target !== "string") {
    throw new Error("Invalid option: directory");
  }

  if (!target.includes(process.cwd())) {
    target = join(process.cwd(), target);
  }

  if (target.endsWith(name)) return target;
  else {
    try {
      const files = await readdir(target);
      const prefix = ["src", "components", "cmp", "component"].find((_) =>
        files.includes(_)
      );
      if (prefix) {
        return join(target, prefix, name);
      } else {
        return join(target, name);
      }
    } catch (e) {
      return join(target, name);
    }
  }
};
