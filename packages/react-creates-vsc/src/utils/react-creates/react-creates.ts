import execa from 'execa';
import { window } from 'vscode';
import { isNil } from 'lodash';
import { parseTarget } from 'react-creates/dist/scripts/component/parsers/parse-target';
import { Language } from 'react-creates/dist/scripts/component/parsers/parse-language';
import { Styles } from 'react-creates/dist/scripts/component/parsers/parse-style';
import { Types } from 'react-creates/dist/scripts/component/parsers/parse-type';

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
    let types, language, style, propTypes;

    if (isCustom === customOption.custom) {
      target = (await window.showInputBox({ value: target })) || target;
      types = await window.showQuickPick(Object.values(Types), {
        placeHolder: 'Type of component to create',
      });
      language = await window.showQuickPick(Object.values(Language), {
        placeHolder: 'Type of language',
      });
      style = await window.showQuickPick(Object.values(Styles), { placeHolder: 'Type of style' });
      propTypes = false;

      if (language === Language.JAVASCRIPT) {
        const propTypeOptions = {
          YES: 'Yes',
          NO: 'No',
        };
        propTypes =
          (await window.showQuickPick(Object.values(propTypeOptions), {
            placeHolder: 'Show use props types',
          })) === propTypeOptions.YES;
      }

      const nilKeys = Object.entries({
        types,
        language,
        style,
        propTypes,
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

    window.showInformationMessage('Creates component: ' + name + ', Please wait ⚛️');

    return await execa('npx', ['react-creates', 'component', name, '-d', target, ...options]);
  }
}
