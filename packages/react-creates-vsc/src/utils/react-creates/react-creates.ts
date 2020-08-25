import execa from 'execa';
import { window, ProgressLocation } from 'vscode';
import { isNil } from 'lodash';
import { ValuesType } from 'utility-types';
import { parseTarget, Language, Styles, Types, getConfig, Config, PARSE_KEYS } from 'react-creates';
import { cacheTypes, getQuickOptions, getYesOrNoQuestion, yesOrNoQuestion } from './utils';

const getStyleQuestions = async () => await getQuickOptions<Styles>('Type of style', Styles);
const getTypesQuestions = async () => await getQuickOptions<Types>('Type of style', Types);

export default class ReactCreates {
  static async start(target: string) {
    return new ReactCreates(target, await getConfig({ target }));
  }

  private constructor(private target: string, private readonly config: Config) {}

  async cleanCache() {
    this.config.clean();
  }

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

      types = await getTypesQuestions();

      language = await getQuickOptions('Type of language', {
        AUTO: 'Auto calculate (easy)',
        ...Language,
      });

      if ((language as any) === 'AUTO') {
        language = undefined;
      }

      style = await getStyleQuestions();

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

    options.push(
      '-s',
      style ||
        this.config.get<Styles>(PARSE_KEYS.STYLE) ||
        this.config.set(PARSE_KEYS.STYLE, await getStyleQuestions())
    );

    if (propTypes) {
      options.push('-pt');
    }

    options.push(
      '-t',
      types ||
        this.config.get<Types>(PARSE_KEYS.TYPE) ||
        this.config.set(PARSE_KEYS.TYPE, await getTypesQuestions())
    );

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
