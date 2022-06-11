import nodeFs from '@file-services/node';
import { FileSystemCache } from './file-system-cache';

export async function fetchTemplate(path: string[], templatesDirectory = getTempTemplatesDirectory()) {
  const repo = 'tzachbon/react-creates';
  const directory = ['templates', ...path].join('/');

  const targetTemplateDirectory = nodeFs.resolve(templatesDirectory, ...path);

  if (!(await nodeFs.promises.exists(targetTemplateDirectory))) {
    await nodeFs.promises.mkdir(targetTemplateDirectory, { recursive: true });

    const { default: degit } = await import('degit');

    await degit(`${repo}/${directory}`, { cache: true, force: true }).clone(targetTemplateDirectory);
  }

  return { templatesDirectory, targetTemplateDirectory };
}

function getTempTemplatesDirectory() {
  const rootDir = nodeFs.dirname(require.resolve('react-creates/package.json'));
  const cachePath = FileSystemCache.getCacheRootPath({ rootDir });

  return nodeFs.resolve(cachePath, 'templates');
}
