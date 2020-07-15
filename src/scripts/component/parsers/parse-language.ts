import isTypescript from "../../../utils/is-typescript";

export const LANGUAGES = {
  TYPESCRIPT: "typescript",
  JAVASCRIPT: "javascript",
};

export const MESSAGE = `Select the language you want the component to be created. (${LANGUAGES.TYPESCRIPT} or ${LANGUAGES.JAVASCRIPT})`;

export async function parseLanguage(language: string) {
  return typeof language === "string" &&
    Object.values(LANGUAGES).includes(language.toLowerCase())
    ? language
    : (await isTypescript())
    ? LANGUAGES.TYPESCRIPT
    : LANGUAGES.JAVASCRIPT;
}
