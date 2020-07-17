import execa from "execa";

export const createNpm = async (target: string) => {
  await execa("echo test", { cwd: target });
};
