import fs from "fs";
import ncp from "ncp";
import tempy from "tempy";
import chalk from "chalk";
import { join } from "path";
import { promisify } from "util";
import { Language } from "./../../src/scripts/component/parsers/parse-language";
import { componentTestkit } from "./component.testkit";
import { Styles } from "../../src/scripts/component/parsers/parse-style";

const copy = promisify(ncp);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);

interface TempProjectDriver {
  typescript?: boolean;
  style?: Styles;
  projectName?: string;
}

class TempProject {
  target: string;
  projectName: string;

  constructor(public options: TempProjectDriver = {}) {
    const { projectName } = this.options;
    this.projectName = projectName || "temp-project";
  }

  async start() {
    const { typescript } = this.options;

    this.target = tempy.directory();

    console.log(chalk`
    Project created here: ${chalk.bold(this.target)}
    `);

    const projectLanguage = Boolean(typescript)
      ? Language.TYPESCRIPT
      : Language.JAVASCRIPT;

    const mockPath = join(
      __dirname,
      "..",
      "mocks",
      "create-react-app",
      projectLanguage
    );

    await copy(mockPath, this.target);
  }

  async projectFiles() {
    return await readdir(this.target);
  }

  async createComponent(cmpName: string, args: string[] = []) {
    const componentDriver = componentTestkit(cmpName, {
      target: this.target,
      typescript: this.options.typescript,
    });

    await componentDriver.create(args);

    return componentDriver;
  }

  async reset() {
    await rmdir(this.target, { recursive: true });
    this.target = null;
  }
}

export const tempProjectTestkit = (options: TempProjectDriver = {}) =>
  new TempProject(options);
