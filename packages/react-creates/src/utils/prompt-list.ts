import { startCase } from "lodash";
import { prompt } from "inquirer";

const shouldUseStartCase = (should: boolean, str: string) =>
  should ? startCase(str) : str;

export const promptList = async <T>(
  name: string,
  message: string,
  options: { name?: string; value: T }[],
  useStartCase = true
) =>
  (
    await prompt([
      {
        name,
        type: "list",
        message,
        choices: [
          ...options.map(({ value, name }) => ({
            name: shouldUseStartCase(useStartCase, name ?? String(value)),
            value,
          })),
        ],
      },
    ])
  )[name] as string;
