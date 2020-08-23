import { program } from 'commander';
import { LANGUAGE_MESSAGE, parseLanguage } from './parsers/parse-language';
import { parseStyle, Styles } from './parsers/parse-style';
import { parseTarget } from './parsers/parse-target';
import { TYPE_MESSAGE, parseTypes, Types } from './parsers/parse-type';
import { runCreateComponent } from './run';
import { CreateComponentOptions } from './types';
import chalk from 'chalk';
import { optionsLogger } from './options-logger';
import { parsePropTypes } from './parsers/parse-prop-types';
import { checkForMainDependencies } from '../../utils/error';
import getConfig from '../../utils/config';

export const createComponent = () =>
  program
    .command('component <name>')
    .description('Creates react component')
    // .option(
    //   "--entry",
    //   "Bootstraps the component with the 'ReactDOM.render' function",
    //   false
    // )
    .option('--scss')
    .option('--css')
    .option('--sass')
    .option('-l --language <scripting>', LANGUAGE_MESSAGE)
    .option('-d --directory <target>', 'Component directory', process.cwd())
    .option('-t --type <component>', TYPE_MESSAGE, Types.FUNCTION)
    .option('-pt --prop-types', 'Should add Prop-types if inside javascript project')
    .option('-f --function', 'Generate function component')
    .option('-c --class', 'Generate class component')
    .option('--skip-test', 'Will not create test file')
    .option('-s --style <styling>', 'Selected the style', Styles.CSS)
    .option('--clean-cache', 'Cleans cache data')
    .action(async (name, _) => {
      let {
        type,
        language,
        entry,
        style,
        scss,
        css,
        sass,
        propTypes,
        skipTest,
        function: func,
        directory: target,
        class: klass,
        cleanCache
      } = _.opts();

      const config = await getConfig({ target });

      if (cleanCache) {
        return config.clean()
      }

      const styles = { scss, css, sass };

      for (const [styleName, isOn] of Object.entries(styles)) {
        if (isOn) {
          style = styleName;
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
          type: await parseTypes({ type, config }),
          language: await parseLanguage({ language, target, config }),
          style: await parseStyle(style),
          propTypes: await parsePropTypes({ propTypes, target }),
          entry: Boolean(entry),
          skipTest: Boolean(skipTest),
        };

        optionsLogger(options);
        await runCreateComponent(options);
      } catch (e) {
        throw e;
      }
    });
