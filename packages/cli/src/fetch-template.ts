import nodeFs from '@file-services/node';
import { fork } from 'child_process';
import { once } from 'events';
import { FileSystemCache } from './file-system-cache';

export async function fetchTemplate(path: string[], templatesDirectory = getTempTemplatesDirectory()) {
  const request = `tzachbon/react-creates/${['templates', ...path].join('/')}`;

  const targetTemplateDirectory = nodeFs.resolve(templatesDirectory, ...path);

  await once(fork(require.resolve('degit/degit'), [request, targetTemplateDirectory]), 'exit');

  return { templatesDirectory, targetTemplateDirectory };
}

function getTempTemplatesDirectory() {
  const rootDir = nodeFs.dirname(require.resolve('react-creates/package.json'));
  const cachePath = FileSystemCache.getCacheRootPath({ rootDir });

  return nodeFs.resolve(cachePath, 'templates');
}
