import { WithConfig } from '../../../utils/config';
import { isBoolean } from 'lodash';

interface Params extends WithConfig {
  skipTest: boolean;
}

type ParseSkipTest = (options: Params) => Promise<boolean>;

const KEY = 'skipTest';

export const parseSkipTest: ParseSkipTest = async ({ skipTest, config, ignoreCache }) => {
  if (isBoolean(skipTest)) return config.set(KEY, skipTest);
  else if (!ignoreCache && config.has(KEY)) return config.get<boolean>(KEY);
  else return false;
};
