import nodeFs from '@file-services/node';
import { fork } from 'child_process';
import { once } from 'events';

export async function fetchTemplate(
  path: string[],
  templatesDirectory = nodeFs.join(nodeFs.dirname(require.resolve('react-creates/package.json')), 'templates')
) {
  const request = `tzachbon/react-creates/${['templates', ...path].join('/')}`;

  const targetTemplateDirectory = nodeFs.resolve(templatesDirectory, ...path);

  await once(fork(require.resolve('degit/degit'), [request, targetTemplateDirectory]), 'exit');

  return { templatesDirectory, targetTemplateDirectory };
}
