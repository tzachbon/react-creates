import { program } from "commander";
import {
  parseLanguage,
  MESSAGE as LANGUAGE_MESSAGE,
  Language,
} from "./parsers/parse-language";
import {
  Types,
  parseTypes,
  MESSAGE as TYPE_MESSAGE,
} from "./parsers/parse-type";
import { parseStyle, Styles } from "./parsers/parse-style";
import { CreateComponentOptions } from "./types";
import { runCreateComponent } from "./run";

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
    .option("-l --language <scripting>", LANGUAGE_MESSAGE, Language.JAVASCRIPT)
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

      console.log(language);

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
        const options: CreateComponentOptions = {
          name,
          target: target ?? process.cwd(),
          type: await parseTypes(type),
          language: await parseLanguage(language),
          style: await parseStyle(style),
          entry: Boolean(entry),
          propTypes: Boolean(propTypes),
        };

        await runCreateComponent(options);
      } catch (e) {
        throw e;
      }
    });
