import { join } from "path";
import { copyTemplate } from "../../utils/copy-template";
import { replaceVariables, Variables } from "../../utils/replace-variables";
import { CreateComponentOptions } from "./types";

export const runCreateComponent = async (options: CreateComponentOptions) => {
  const { target, language, type } = options;

  const templatesPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    language,
    "component",
    type
  );

  await copyTemplate(templatesPath, target, options);
  await replaceVariables(target, (options as unknown) as Variables);
};
