import getPackageJson from '../../../utils/get-package-json';
import { WithConfig } from '../../../utils/config';
import { PARSE_KEYS } from './keys';

interface Params extends WithConfig {
  propTypes: boolean;
  target?: string;
}

type ParsePropTypes = (options: Params) => Promise<boolean>;

const KEY = PARSE_KEYS.PROP_TYPES;

export const parsePropTypes: ParsePropTypes = async ({
  propTypes,
  config,
  target = process.cwd(),
  ignoreCache,
}) => {
  if (propTypes) return config.set(KEY, propTypes);
  else if (!ignoreCache && config.has(KEY)) return config.get<boolean>(KEY);

  const packageJson = (await getPackageJson({ cwd: target })) || {};
  const { dependencies } = packageJson;

  propTypes = Boolean(dependencies?.['prop-types']);

  return config.set(KEY, propTypes);
};
