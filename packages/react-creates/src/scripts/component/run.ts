import { CreateComponentOptions } from "./types";
import { join, sep } from "path";
import { copyTemplate } from "../../utils/copy-template";
import { replaceVariables, Variables } from "../../utils/replace-variables";

export const runCreateComponent = async (options: CreateComponentOptions) => {
  const { target, language } = options;

  const templatesPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    language,
    "component"
  );

  await copyTemplate(templatesPath, target);
  await replaceVariables(target, (options as unknown) as Variables);
};