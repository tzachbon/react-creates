import { Types } from "./parsers/parse-type";
import { Language } from "./parsers/parse-language";
import { Styles } from "./parsers/parse-style";

export interface CreateComponentOptions {
  name: string;
  type: Types;
  language: Language;
  style: Styles;
  entry: boolean
}
