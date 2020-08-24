import fs from 'fs';
import ncp from 'ncp';
import tempy from 'tempy';
import chalk from 'chalk';
import { join } from 'path';
import { promisify } from 'util';
import { Language } from '../../src/scripts/component/parsers/parse-language';
import { componentTestkit, Component } from './component.testkit';
import { Styles } from '../../src/scripts/component/parsers/parse-style';
import execa from 'execa';
import Configstore from 'configstore';
import chance from 'chance';

const copy = promisify(ncp);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);

interface TempProjectDriver {
  typescript?: boolean;
  style?: Styles;
  projectName?: string;
  install?: boolean;
  target?: string;
  skipCacheClean?: boolean;
}

export class TempProject {
  target: string;
  name: string;
  components: [string, Component][] = [];
  config: Configstore;

  constructor(public options: TempProjectDriver = {}) {
    const { projectName, target } = this.options;
    this.name = (projectName || 'temp-project') + new chance.Chance().name().split(' ').join('');
    this.target = target ?? tempy.directory();
    this.config = new Configstore(this.name);
  }

  beforeAndAfter() {
    beforeAll(async () => await this.start());
    afterAll(async () => await this.reset());

    return this;
  }

  async start() {
    const { typescript } = this.options;

    console.log(chalk`
    Project created here: ${chalk.bold(this.target)}
    `);

    const projectLanguage = Boolean(typescript) ? Language.TYPESCRIPT : Language.JAVASCRIPT;

    const mockPath = join(__dirname, '..', 'mocks', 'create-react-app', projectLanguage);

    await copy(mockPath, this.target);

    await this.updatePackageJsonName(this.target);

    if (this.options.install) {
      await execa('yarn', { cwd: this.target });
    }
  }

  private async updatePackageJsonName(target: string) {
    const packageJsonPath = join(target, 'package.json');

    const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonRaw);

    packageJson.name = this.name;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
  }

  async projectFiles() {
    return await readdir(this.target);
  }

  async createComponent(cmpName: string, args: string[] = [], { skipBeforeAndAfter = false } = {}) {
    const hasComponentWithTheSameName = this.components.some(([name]) => name === cmpName);

    if (hasComponentWithTheSameName) {
      console.log(
        chalk.yellowBright`${chalk.bold`Warning:`} You already have this component name: ${chalk.bold(
          cmpName
        )}`
      );
    }

    const componentDriver = componentTestkit(cmpName, {
      target: this.target,
      typescript: this.options.typescript,
    });

    await componentDriver.create(args);

    this.components.push([cmpName, componentDriver]);

    if (skipBeforeAndAfter) {
      return componentDriver;
    }

    return componentDriver.beforeAndAfter();
  }

  async reset() {
    await rmdir(this.target, { recursive: true });

    if (!this.options.skipCacheClean && this.hasConfig) {
      fs.unlinkSync(this.configPath);
    }
  }

  async runScript(script: 'start' | 'test' | 'build' = 'start') {
    try {
      return await execa('npm', ['run', script], { cwd: this.target });
    } catch (e) {
      return e;
    }
  }

  get configPath() {
    return `~/.config/configstore/${this.name}.json`;
  }

  get hasConfig() {
    return fs.existsSync(this.configPath) && fs.lstatSync(this.configPath).isFile();
  }
}

export const tempProjectTestkit = (options: TempProjectDriver = {}) => new TempProject(options);
