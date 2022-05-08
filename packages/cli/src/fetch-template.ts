import nodeFs from '@file-services/node';
import degit from 'degit';

const REPO_URL = 'https://github.com/tzachbon/react-creates';

export async function fetchTemplate(path: string[]) {
  const emitter = degit(`${REPO_URL}/${['templates', ...path].join('/')}`, {
    cache: true,
    force: true,
  });

  const templatesDirectory = nodeFs.join(nodeFs.dirname(require.resolve('react-creates/package.json')), 'templates');
  const targetTemplateDirectory = nodeFs.join(templatesDirectory, ...path);

  await emitter.clone(targetTemplateDirectory);

  return { templatesDirectory, targetTemplateDirectory };
}
