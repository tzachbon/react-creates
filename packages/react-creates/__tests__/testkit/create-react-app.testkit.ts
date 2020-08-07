import fs from "fs";
import ncp from "ncp";
import tempy from "tempy";
import chalk from "chalk";
import { join } from "path";
import { promisify } from "util";
import { Language } from "../../src/scripts/component/parsers/parse-language";
import { componentTestkit } from "./component.testkit";
import { Styles } from "../../src/scripts/component/parsers/parse-style";
import execa from "execa";

const copy = promisify(ncp);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);

interface TempProjectDriver {
  typescript?: boolean;
  style?: Styles;
  projectName?: string;
  install?: boolean;
  target?: string;
}

class TempProject {
  target: string;
  projectName: string;

  constructor(public options: TempProjectDriver = {}) {
    const { projectName, target } = this.options;
    this.projectName = projectName || "temp-project";
    this.target = target ?? tempy.directory()
  }

  beforeAndAfter() {
    beforeAll(async () => await this.start());
    afterAll(async () => await this.reset());
  }

  async start() {
    const { typescript } = this.options;

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

    if (this.options.install) {
      await execa("yarn", { cwd: this.target });
    }
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
  }

  async runScript(script: "start" | "test" | "build" = "start") {
    try {
      return await execa("npm", ["run", script], { cwd: this.target });
    } catch (e) {
      return e;
    }
  }
}

export const tempProjectTestkit = (options: TempProjectDriver = {}) =>
  new TempProject(options);
