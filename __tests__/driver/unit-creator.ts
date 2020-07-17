import execa from "execa";

export enum Units {
  COMPONENT = "component",
}

export const unitCreator = async (
  unit: Units,
  args: string[] = [],
  target = process.cwd()
) => await execa("react-creates", [unit, ...args], { cwd: target });
