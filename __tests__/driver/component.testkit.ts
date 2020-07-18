import fs from "fs";
import execa from "execa";
import chalk from "chalk";
import { promisify } from "util";
import { Styles } from "../../src/scripts/component/parsers/parse-style";

const readdir = promisify(fs.readdir);

export interface ComponentOptions {
  target: string;
  typescript?: boolean;
  style?: Styles;
}

export const componentTestkit = (name: string, options: ComponentOptions) =>
  new Component(name, options);

class Component {
  private target: string;
  private path: string | null = null;

  constructor(private name: string, private options: ComponentOptions) {
    this.target = options.target;
  }

  static getValueFromOutput(output: string, start: string, end: string = "\n") {
    return output.split(start)[1].split(end)[0].trim();
  }

  async create(args: string[] = []) {
    if (this.options.typescript) {
      args.push("-l", "typescript");
    }

    if (this.options.style) {
      args.push("-s", this.options.style);
    }

    const command = await execa(
      "react-creates",
      ["component", this.name, ...args],
      {
        cwd: this.target,
      }
    );

    const output = command.stdout;

    this.path = Component.getValueFromOutput(output, "⚛️ Target: ");
    
    return this;
  }

  async getFiles() {
    if (!this.path) {
      console.error(chalk.red`
      ### Error: Component path is not found.
      you probable forgot to run the ${chalk.bold`create`} method at the start.
      `);
      throw new Error("Path not found");
    }

    return await readdir(this.path);
  }

  async testFileExists() {
    const files = await this.getFiles();
    return files.includes(`${this.name}.test.${this.fileSuffix}`);
  }

  async componentFileExists() {
    const files = await this.getFiles();
    const hasMainFile = files.includes(`${this.name}.${this.fileSuffix}`);
    const hasIndexFile = files.includes(`index.${this.fileSuffix}`);

    return hasIndexFile && hasMainFile;
  }

  async isStyleMatch(style: Styles = this.options.style || Styles.CSS) {
    const files = await this.getFiles();
    return files.includes(`style.${style}`);
  }

  get fileSuffix() {
    return this.options.typescript ? "tsx" : "js";
  }
}
