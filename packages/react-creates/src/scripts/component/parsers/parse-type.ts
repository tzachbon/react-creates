import { promptList } from '../../../utils/prompt-list';
import { isString } from 'lodash';
import { WithConfig } from '../../../utils/config';

export enum Types {
  FUNCTION = 'function',
  CLASS = 'class',
}

interface Params extends WithConfig {
  type: Types;
}

const KEY = 'type'

export const TYPE_MESSAGE = `What type of the component it should be. (${Types.FUNCTION} or ${Types.CLASS})`;

export const parseTypes = async ({ type, config }: Params) => {
  if (isString(type) && Object.values(Types).includes(type)) {
    return config.set(KEY, type);
  } else if (config.has(KEY)) {
    return config.get<Types>(KEY)
  } else {
    return (await promptList(
      KEY,
      TYPE_MESSAGE,
      Object.values(Types).map((value) => ({ value }))
    )) as Types;
  }
};
