import { promptList } from '../../../utils/prompt-list';
import { isString } from 'lodash';
import { WithConfig } from '../../../utils/config';
import { PARSE_KEYS } from './keys';

export enum Types {
  FUNCTION = 'function',
  CLASS = 'class',
}

interface Params extends WithConfig {
  type: Types;
}

const KEY = PARSE_KEYS.TYPE;

export const TYPE_MESSAGE = `What type of the component it should be. (${Types.FUNCTION} or ${Types.CLASS})`;

export const parseTypes = async ({ type, config, ignoreCache }: Params) => {
  if (isString(type) && Object.values(Types).includes(type)) {
    return config.set(KEY, type);
  } else if (!ignoreCache && config.has(KEY)) {
    return config.get<Types>(KEY);
  } else {
    type = (await promptList(
      KEY,
      TYPE_MESSAGE,
      Object.values(Types).map((value) => ({ value }))
    )) as Types;

    return config.set(KEY, type);
  }
};
