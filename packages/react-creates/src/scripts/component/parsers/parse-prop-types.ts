import getPackageJson from '../../../utils/get-package-json';
import { WithConfig } from '../../../utils/config';

interface Params extends WithConfig {
  propTypes: boolean;
  target?: string;
}

type ParsePropTypes = (options: Params) => Promise<boolean>;

const KEY = 'propTypes';

export const parsePropTypes: ParsePropTypes = async ({
  propTypes,
  config,
  target = process.cwd(),
}) => {
  if (propTypes) return config.set(KEY, propTypes);
  else if (config.has(KEY)) return config.get<boolean>(KEY);

  const packageJson = (await getPackageJson({ cwd: target })) || {};
  const { dependencies } = packageJson;

  return config.set(KEY, Boolean(dependencies?.['prop-types']));
};
