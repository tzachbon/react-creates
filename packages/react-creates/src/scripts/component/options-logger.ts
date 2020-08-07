import chalk from "chalk";
import { startCase } from "lodash";
import { CreateComponentOptions } from "./types";

export const optionsLogger = (options: CreateComponentOptions) => {
  for (const [name, value] of Object.entries(options)) {
    if (Boolean(value))
      console.log(`       ⚛️ ${startCase(name)}: ${chalk.bold.green(value)}`);
  }
  console.log('');
  
};
