import fs from "fs";
import { promisify } from "util";
import { join } from "path";
import tempy from "tempy";
import { createReactApp } from "./create-react-app";
import { unitCreator, Units } from "./unit-creator";
import { CreateComponentOptions } from "../../src/scripts/component/types";

const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);

interface TempProjectDriver {
  typescript?: boolean;
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
    await createReactApp({
      typescript,
      target: this.target,
      projectName: this.projectName,
    });
  }

  async projectFiles() {
    return await readdir(
      this.projectName ? join(this.target, this.projectName) : this.target
    );
  }

  async createComponent(cmpName: string) {
    // await unitCreator(Units.COMPONENT, [cmpName], this.target);
    const projectFiles = await this.projectFiles();

    return projectFiles;
  }

  async reset() {
    await rmdir(this.target, { recursive: true });
    this.target = null;
  }
}

export const tempProjectTestkit = (options: TempProjectDriver = {}) =>
  new TempProject(options);
