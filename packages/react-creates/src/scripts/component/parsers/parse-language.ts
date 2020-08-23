import isTypescript from '../../../utils/is-typescript';
import { WithConfig } from '../../../utils/config';
import { isString } from 'lodash';

export enum Language {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
}

interface Params extends WithConfig {
  language: Language;
  target: string;
}

const KEY = 'language';

export const LANGUAGE_MESSAGE = `Select the language you want the component to be created. (${Language.TYPESCRIPT} or ${Language.JAVASCRIPT})`;

export async function parseLanguage({ language, target, config }: Params) {
  const hasAskedForLanguage =
    isString(language) && Object.values(Language).includes(language as any);

  if (hasAskedForLanguage) {
    return config.set(KEY, language);
  } else if (config.has(KEY)) {
    return config.get<Language>(KEY);
  } else {
    language = (await isTypescript(target)) ? Language.TYPESCRIPT : Language.JAVASCRIPT;
    return config.set(KEY, language);
  }
}
