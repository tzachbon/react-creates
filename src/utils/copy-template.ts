import { exists as existsCb, mkdir as mkdirCb } from "fs";
import npc from "ncp";
import { sep } from "path";
import { promisify } from "util";

const copy = promisify(npc);
const exists = promisify(existsCb);
const mkdir = promisify(mkdirCb);

const isTemp = process.env.TEMP === "true";
const shouldAddTemp = (path) => path + (isTemp ? sep + "__temp" : "");

export const copyTemplate = async (
  templatesPath: string,
  targetComponentPath: string
) => {
  const targetComponentPathExists = await exists(targetComponentPath);

  if (!targetComponentPathExists) {
    await mkdir(targetComponentPath);
  }

  await copy(templatesPath, shouldAddTemp(targetComponentPath), {
    clobber: true,
  });
};
