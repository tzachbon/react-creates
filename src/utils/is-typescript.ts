import { exists as existsCb } from "fs";
import { promisify } from "util";
import { join } from "path";

const exists = promisify(existsCb);

let __isTypescriptCache: boolean;

const _isTypescript = async (target: string) => {
  __isTypescriptCache = await exists(join(target, "tsconfig.json"));
  return __isTypescriptCache;
};

export default async function isTypescript(target = process.cwd()) {
  return __isTypescriptCache ?? (await _isTypescript(target));
}
