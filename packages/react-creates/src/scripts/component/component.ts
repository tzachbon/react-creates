import { program } from 'commander';
import chalk from 'chalk';

import getConfig from '../../utils/config';
import { runCreateComponent } from './run';
import { CreateComponentOptions } from './types';
import { optionsLogger } from './options-logger';
import { checkForMainDependencies } from '../../utils/error';

import { parsePropTypes } from './parsers/parse-prop-types';
import { parseSkipTest } from './parsers/parse-skip-test';
import { parseStyle, Styles } from './parsers/parse-style';
import { parseTarget } from './parsers/parse-target';
import { LANGUAGE_MESSAGE, parseLanguage, Language } from './parsers/parse-language';
import { TYPE_MESSAGE, parseTypes, Types } from './parsers/parse-type';

export const createComponent = () =>
  program
    .command('component <name>')
    .description('Creates react component')
    .option('--scss')
    .option('--css')
    .option('--sass')
    .option('-l --language <scripting>', LANGUAGE_MESSAGE)
    .option('-d --directory <target>', 'Component directory', process.cwd())
    .option('-t --type <component>', TYPE_MESSAGE)
    .option('-pt --prop-types', 'Should add Prop-types if inside javascript project')
    .option('-f --function', 'Generate function component')
    .option('-c --class', 'Generate class component')
    .option('--skip-test', 'Will not create test file')
    .option('-s --style <styling>', 'Selected the style')
    .option('--skip-cache', "Won't use cache values")
    .action(async (name, _) => await createComponentRaw(name, _.opts()));

export interface CreateComponent {
  type?: Types;
  language?: Language;
  style?: Styles;
  scss?: boolean;
  css?: boolean;
  sass?: boolean;
  propTypes?: boolean;
  skipTest?: boolean;
  function?: boolean;
  directory?: string;
  class?: boolean;
  skipCache?: boolean;
}

export const createComponentRaw = async (
  name: string,
  {
    type,
    language,
    style,
    scss,
    css,
    sass,
    propTypes,
    skipTest,
    function: func,
    directory: target,
    class: klass,
    skipCache,
  }: CreateComponent
) => {
  const config = await getConfig({ target });

  const styles = { scss, css, sass };

  for (const [styleName, isOn] of Object.entries(styles)) {
    if (isOn) {
      style = styleName as Styles;
      break;
    }
  }

  if (Boolean(klass)) {
    type = Types.CLASS;
  }

  if (Boolean(func)) {
    type = Types.FUNCTION;
  }

  try {
    console.log(`
        React Creates: ${chalk.blueBright.bold('Component')} 

        Parsing arguments...
        `);

    target = await parseTarget({ name, target });

    await checkForMainDependencies({ target });

    const options: CreateComponentOptions = {
      name,
      target,
      type: await parseTypes({ type, config, skipCache }),
      language: await parseLanguage({ language, target, config, skipCache }),
      style: await parseStyle({ style, config, skipCache }),
      propTypes: await parsePropTypes({ propTypes, target, config, skipCache }),
      skipTest: await parseSkipTest({ skipTest, config, skipCache }),
    };

    await parseTypes({ type, config, skipCache })

    optionsLogger(options);
    await runCreateComponent(options);
  } catch (e) {
    throw e;
  }
};
