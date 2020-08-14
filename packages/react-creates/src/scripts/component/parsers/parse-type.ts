import { promptList } from "../../../utils/prompt-list";

export enum Types {
  FUNCTION = "function",
  CLASS = "class",
}

export const TYPE_MESSAGE = `What type of the component it should be. (${Types.FUNCTION} or ${Types.CLASS})`;

export const parseTypes = async (type: Types) => {

  if (
    typeof type === "string" &&
    Object.values(Types).includes(type)
  ) {
    return type;
  } else {
    return await promptList(
      "type",
      TYPE_MESSAGE,
      Object.values(Types).map((value) => ({ value }))
    ) as Types;
  }
};
