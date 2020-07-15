import { promptList } from "../../../utils/prompt-list";

export const STYLES = {
  SCSS: "scss",
  CSS: "css",
  SASS: "sass",
};

export const MESSAGE = `Select the type of style you want: (${Object.values(
  STYLES
).join(",")})`;

let _lastStyle: string;

export async function parseStyle(style: string) {
  if (
    typeof style === "string" &&
    Object.values(STYLES).includes(style.toLowerCase())
  ) {
    _lastStyle = style.toLowerCase();
  } else if (_lastStyle) {
    return _lastStyle;
  } else {
    _lastStyle = await promptList(
      "style",
      MESSAGE,
      Object.values(STYLES).map((value) => ({ value })),
      false
    );
  }
  return _lastStyle;
}
