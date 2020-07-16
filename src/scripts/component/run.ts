import { CreateComponentOptions } from "./types";
import { join, sep } from "path";
import { copyTemplate } from "../../utils/copy-template";
import { replaceVariables, Variables } from "../../utils/replace-variables";

export const runCreateComponent = async (options: CreateComponentOptions) => {
  const { name, target, language } = options;

  const templatesPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    language,
    "component"
  );

  const targetComponentPath = target.endsWith(sep + name)
    ? target
    : join(target, name);

  await copyTemplate(templatesPath, targetComponentPath);
  await replaceVariables(targetComponentPath, options as unknown as Variables);
};
