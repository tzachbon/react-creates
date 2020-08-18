import fs from 'fs';
import npc, { Options } from 'ncp';
import { sep } from 'path';
import { promisify } from 'util';
import { CreateComponentOptions } from '../scripts/component/types';

const copy = promisify(npc);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const isDir = (file: string) =>
  fs.lstatSync(file).isDirectory();
const isTemp = process.env.TEMP === 'true';
const shouldAddTemp = (path) =>
  path + (isTemp ? sep + '__temp' : '');

export const copyTemplate = async (
  templatesPath: string,
  targetComponentPath: string,
  options: CreateComponentOptions
) => {
  const targetComponentPathExists = await exists(
    targetComponentPath
  );

  if (!targetComponentPathExists) {
    await mkdir(targetComponentPath);
  }

  const copyOptions: Options = {
    clobber: true,
  };

  if (options.skipTest) {
    copyOptions.filter = (file) =>
      isDir(file) ||
      /^(?!.*\.test\.(js|ts)$).*/.test(
        file
      );
  }

  await copy(
    templatesPath,
    shouldAddTemp(targetComponentPath),
    copyOptions
  );
};
