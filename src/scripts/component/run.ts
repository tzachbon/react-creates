import { CreateComponentOptions } from "./types";
import { join, sep } from "path";
import { exists as existsCb, mkdir as mkdirCb } from "fs";
import npc from "ncp";
import { promisify } from "util";

const copy = promisify(npc);
const exists = promisify(existsCb);
const mkdir = promisify(mkdirCb);

const isTemp = process.env.TEMP === "true";
const shouldAddTemp = (path) => path + (isTemp ? sep + "__temp" : "");

export const runCreateComponent = async (options: CreateComponentOptions) => {
  let { name, target, language } = options;

  const templatesPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    language,
    "component"
  );

  const targetComponentPath = target.endsWith(sep + name)
    ? target
    : join(target, name);

  const targetComponentPathExists = await exists(targetComponentPath);

  if (!targetComponentPathExists) {
    await mkdir(targetComponentPath);
  }

  await copy(templatesPath, shouldAddTemp(targetComponentPath));

};
