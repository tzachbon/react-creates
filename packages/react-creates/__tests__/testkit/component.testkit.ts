import fs from 'fs';
import execa from 'execa';
import chalk from 'chalk';
import { promisify } from 'util';
import { Styles } from '../../src/scripts/component/parsers/parse-style';
import { parseTarget } from '../../src/scripts/component/parsers/parse-target';

const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);

export interface ComponentOptions {
  target: string;
  typescript?: boolean;
  style?: Styles;
}

export const componentTestkit = (name: string, options: ComponentOptions) =>
  new Component(name, options);

export class Component {
  private target: string;
  private path: string | null = null;

  constructor(public name: string, private options: ComponentOptions) {
    this.target = options.target;
  }

  static getValueFromOutput(output: string, start: string, end: string = '\n') {
    return output.split(start)[1].split(end)[0].trim();
  }

  get componentPath() {
    return this.path;
  }

  beforeAndAfter() {
    beforeEach(async () => {
      await this.reset();
    });

    return this;
  }



  async reset() {
    await this.delete();
  }

  async create(args: string[] = [], { skipCwd = true } = {}) {
    if (this.options.style && !args.includes('-s')) {
      args.push('-s', this.options.style);
    }

    const command = await execa('react-creates', ['component', this.name, ...args], {
      cwd: this.target,
    });

    if (command.stderr?.includes('Error:')) {
      throw command;
    }

    this.path = await parseTarget({
      name: this.name,
      target: this.target,
      skipCwd,
    });

    return this;
  }

  async getFiles() {
    if (!this.path) {
      console.error(chalk.red`
      ### Error: Component path is not found.
      you probable forgot to run the ${chalk.bold`create`} method at the start.
      `);
      throw new Error('Path not found');
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

  async delete() {
    await rmdir(this.path, { recursive: true });
  }

  get fileSuffix() {
    return this.options.typescript ? 'tsx' : 'js';
  }
}
