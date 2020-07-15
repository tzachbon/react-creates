import { prompt } from "inquirer";
import { startCase } from "lodash";
import { promptList } from "../../../utils/prompt-list";

export const TYPES = {
  FUNCTION: "function",
  CLASS: "class",
};

export const MESSAGE = `What type of the component it should be. (${TYPES.FUNCTION} or ${TYPES.CLASS})`;

export const parseTypes = async (type: string | undefined | null) => {
  if (
    typeof type === "string" &&
    Object.values(TYPES).includes(type.toLowerCase())
  ) {
    return type.toLowerCase();
  } else {
    return await promptList(
      "type",
      MESSAGE,
      Object.values(TYPES).map((value) => ({ value }))
    );
  }
};
