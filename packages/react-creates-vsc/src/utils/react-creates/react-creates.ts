import execa from 'execa';
import { window, ProgressLocation } from 'vscode';
import { isNil } from 'lodash';
import { ValuesType } from 'utility-types';
import { parseTarget, Language, Styles, Types } from 'react-creates';

const yesOrNoQuestion = {
  YES: 'Yes',
  NO: 'No',
} as const;

const cacheTypes = {
  CACHE: 'Use cache (default)',
  SKIP_CACHE: "Skip cache (won't save cache value)",
} as const;

const getYesOrNoQuestion = async (title: string) =>
  (await window.showQuickPick(Object.values(yesOrNoQuestion), { placeHolder: title })) as
    | ValuesType<typeof yesOrNoQuestion>
    | undefined;

const getQuickOptions = async <T, J extends {} = {}>(title: string, options: J) =>
  (await window.showQuickPick(Object.values(options ?? {}), {
    placeHolder: title,
  })) as T | undefined;

export default class ReactCreates {
  constructor(private target: string) {}

  async createComponent() {
    const name = await window.showInputBox({ prompt: 'Name of the component' });

    if (!name) {
      throw new Error('Hey, component must have a name');
    }

    const customOption = {
      default: 'Auto calculate values',
      custom: 'Choose custom options',
    };
    const isCustom = await window.showQuickPick(Object.values(customOption), {
      placeHolder: customOption.default,
    });

    let target = await parseTarget({ name, target: this.target });
    let types: Types | undefined;
    let language: Language | undefined;
    let style: Styles | undefined;
    let propTypes: boolean | undefined;
    let skipTest: boolean | undefined;
    let cache: ValuesType<typeof cacheTypes> | undefined;

    if (isCustom === customOption.custom) {
      target = (await window.showInputBox({ value: target })) || target;

      types = await getQuickOptions('Type of component to create', Types);

      language = await getQuickOptions('Type of language', {
        AUTO: 'Auto calculate (easy)',
        ...Language,
      });

      if ((language as any) === 'AUTO') {
        language = undefined;
      }

      style = await getQuickOptions('Type of style', Styles);

      propTypes = false;

      if (language === Language.JAVASCRIPT) {
        propTypes = (await getYesOrNoQuestion('Should use props types?')) === yesOrNoQuestion.YES;
      }

      skipTest = (await getYesOrNoQuestion('Should create test file?')) === yesOrNoQuestion.NO;

      cache = await getQuickOptions('Select cache mechanism', cacheTypes);

      const nilKeys = Object.entries({
        types,
        language,
        style,
        propTypes,
        skipTest,
        cache,
      }).filter(([key, _]) => isNil(_));

      if (nilKeys.length) {
        throw new Error(`Invalid value${nilKeys.length === 1 ? '' : 's'} in ${nilKeys.toString()}`);
      }
    }

    const options: string[] = [];

    if (language) {
      options.push('-l', language);
    }

    if (style) {
      options.push('-s', style);
    }

    if (propTypes) {
      options.push('-pt');
    }

    if (types) {
      options.push('-t', types);
    }

    if (skipTest) {
      options.push('--skip-test');
    }

    if (cache === cacheTypes.SKIP_CACHE) {
      options.push('--skip-cache');
    }

    return await window.withProgress(
      {
        title: 'Creates component: ' + name + ', Please wait ⚛️...',
        location: ProgressLocation.Notification,
        cancellable: false,
      },
      async (progress) =>
        await execa('npx', ['react-creates', 'component', name, '-d', target, ...options])
    );
  }
}
