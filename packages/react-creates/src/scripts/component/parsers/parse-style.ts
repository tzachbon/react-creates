import { promptList } from "../../../utils/prompt-list";

export enum Styles {
  SCSS = "scss",
  CSS = "css",
  SASS = "sass",
}

export const MESSAGE = `Select the type of style you want: (${Object.values(
  Styles
).join(",")})`;

let _lastStyle: Styles;

export async function parseStyle(style: Styles) {
  if (
    typeof style === "string" &&
    Object.values(Styles).includes(style as any)
  ) {
    _lastStyle = style;
  } else if (_lastStyle) {
    return _lastStyle;
  } else {
    _lastStyle = await promptList(
      "style",
      MESSAGE,
      Object.values(Styles).map((value) => ({ value })),
      false
    ) as Styles;
  }
  return _lastStyle;
}
