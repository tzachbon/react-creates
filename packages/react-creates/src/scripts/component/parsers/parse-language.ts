import isTypescript from "../../../utils/is-typescript";

export enum Language {
  TYPESCRIPT = "typescript",
  JAVASCRIPT = "javascript",
}

export const LANGUAGE_MESSAGE = `Select the language you want the component to be created. (${Language.TYPESCRIPT} or ${Language.JAVASCRIPT})`;

export async function parseLanguage({ language, target }: { language: Language, target: string }) {

  return typeof language === "string" &&
    Object.values(Language).includes(language as any)
    ? language
    : (await isTypescript(target))
      ? Language.TYPESCRIPT
      : Language.JAVASCRIPT;
}
