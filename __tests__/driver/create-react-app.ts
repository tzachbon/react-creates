import execa from "execa";

export interface CreateReactApp {
  typescript?: boolean;
  target: string;
  projectName: string
}

export const createReactApp = async ({
  typescript = false,
  target,
  projectName
}: CreateReactApp) => {
  await execa("create-react-app", [projectName, typescript ? "--typescript" : ""], {
    cwd: target,
  });
};
