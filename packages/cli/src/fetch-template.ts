import nodeFs from '@file-services/node';
import degit from 'degit';

export async function fetchTemplate(
  path: string[],
  templatesDirectory = nodeFs.join(nodeFs.dirname(require.resolve('react-creates/package.json')), 'templates')
) {
  const request = `tzachbon/react-creates/${['templates', ...path].join('/')}`;
  const emitter = degit(request, {
    cache: true,
    force: true,
  });

  const targetTemplateDirectory = nodeFs.join(templatesDirectory, ...path);

  await emitter.clone(targetTemplateDirectory);

  return { templatesDirectory, targetTemplateDirectory };
}
