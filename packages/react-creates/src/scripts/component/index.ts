import { program } from "commander";
import {
  MESSAGE as LANGUAGE_MESSAGE,
  parseLanguage,
} from "./parsers/parse-language";
import { parseStyle, Styles } from "./parsers/parse-style";
import { parseTarget } from "./parsers/parse-target";
import {
  MESSAGE as TYPE_MESSAGE,
  parseTypes,
  Types,
} from "./parsers/parse-type";
import { runCreateComponent } from "./run";
import { CreateComponentOptions } from "./types";
import chalk from "chalk";
import { optionsLogger } from "./options-logger";

export const createComponent = () =>
  program
    .command("component <name>")
    .description("Creates react component")
    // .option(
    //   "--entry",
    //   "Bootstraps the component with the 'ReactDOM.render' function",
    //   false
    // )
    .option("--scss")
    .option("--css")
    .option("--sass")
    .option("-l --language <scripting>", LANGUAGE_MESSAGE)
    .option("-d --directory <target>", "Component directory", process.cwd())
    .option("-t --type <component>", TYPE_MESSAGE, Types.FUNCTION)
    .option("-pt --prop-types", "Should to add Prop-types")
    .option("-f --function", "Generate function component")
    .option("-s --style <styling>", "Selected the style", Styles.CSS)
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
        function: func,
        directory: target,
      } = _.opts();

      const styles = { scss, css, sass };

      for (const [styleName, isOn] of Object.entries(styles)) {
        if (isOn) {
          style = styleName;
          break;
        }
      }

      if (Boolean(func)) {
        type = Types.FUNCTION;
      }

      try {
        console.log(`
React Creates: ${chalk.blueBright.bold("Component")} 

Parsing arguments...
        `);

        const options: CreateComponentOptions = {
          name,
          target: await parseTarget({ name, target }),
          type: await parseTypes(type),
          language: await parseLanguage(language),
          style: await parseStyle(style),
          entry: Boolean(entry),
          propTypes: Boolean(propTypes),
        };

        optionsLogger(options);
        await runCreateComponent(options);
      } catch (e) {
        throw e;
      }
    });