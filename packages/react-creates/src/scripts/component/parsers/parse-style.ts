import { promptList } from '../../../utils/prompt-list';
import { isString } from 'lodash';
import { WithConfig } from '../../../utils/config';

export enum Styles {
  SCSS = 'scss',
  CSS = 'css',
  SASS = 'sass',
}

export const STYLE_MESSAGE = `Select the type of style you want: (${Object.values(Styles).join(
  ','
)})`;

interface Params extends WithConfig {
  style: Styles;
}

const KEY = 'style';

export async function parseStyle({ style, config }: Params) {
  if (isString(style) && Object.values(Styles).includes(style as any)) {
    return config.set(KEY, style);
  } else if (config.has(KEY)) {
    return config.get<Styles>(KEY);
  } else {
    
    style = (await promptList(
      'style',
      STYLE_MESSAGE,
      Object.values(Styles).map((value) => ({ value })),
      false
    )) as Styles;
  }
  return config.set(KEY, style);
}
