import { program } from "commander";
import {
  parseLanguage,
  MESSAGE as LANGUAGE_MESSAGE,
} from "./parsers/parse-language";
import {
  TYPES,
  parseTypes,
  MESSAGE as TYPE_MESSAGE,
} from "./parsers/parse-type";
import { parseStyle } from "./parsers/parse-style";

export const createComponent = () =>
  program
    .command("component <name>")
    .description("Creates react component")
    .option("-t --type", TYPE_MESSAGE, TYPES.FUNCTION)
    .option("-l --language", LANGUAGE_MESSAGE)
    .option("-pt --prop-types", "Should to add Prop-types")
    .option(
      "--entry",
      "Bootstraps the component with the 'ReactDOM.render' function",
      false
    )
    .option("-s --style", "Selected the style")
    .option("--scss")
    .option("--css")
    .option("--sass")
    .action(async (name, _) => {
      let { type, language, entry, style, scss, css, sass } = _.opts();

      const styles = { scss, css, sass };

      for (const [styleName, isOn] of Object.entries(styles)) {
        if (isOn) {
          style = styleName;
        }
      }

      try {
        const options = {
          name,
          type: await parseTypes(type),
          language: await parseLanguage(language),
          style: await parseStyle(style),
          entry: Boolean(entry),
        };

        console.log(options);
      } catch (e) {
        throw e;
      }
    });
