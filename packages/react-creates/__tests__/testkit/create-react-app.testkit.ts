import { join } from 'path';
import { promisify } from 'util';

import fs from 'fs';
import execa from 'execa';
import chance from 'chance';
import ncp from 'ncp';
import tempy from 'tempy';
import chalk from 'chalk';

import { componentTestkit, Component } from './component.testkit';
import { Language, Styles, Types } from '../../src';

const copy = promisify(ncp);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const exists = promisify(fs.exists);
const lstat = promisify(fs.lstat);

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

  constructor(public options: TempProjectDriver = {}) {
    const { target } = this.options;
    this.target = target ?? tempy.directory();
  }

  beforeAndAfterAll() {
    beforeAll(async () => await this.start());
    afterAll(async () => await this.reset());

    return this;
  }

  beforeAndAfter() {
    beforeEach(async () => await this.start());
    afterEach(async () => await this.reset());

    return this;
  }

  async start() {
    this.name =
      (this.options.projectName || 'temp-project') + new chance.Chance().name().split(' ').join('');

    const { typescript } = this.options;

    console.log(chalk`
    Project created here: ${chalk.bold(this.target)}
    `);

    const projectLanguage = Boolean(typescript) ? Language.TYPESCRIPT : Language.JAVASCRIPT;

    const mockPath = join(__dirname, '..', 'mocks', 'create-react-app', projectLanguage);

    await copy(mockPath, this.target);

    await this.updatePackageJsonName(this.target);

    if (this.options.install) {
      await execa('npm', ['i'], { cwd: this.target });
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

  async createComponent(
    cmpName: string,
    args: string[] = [],
    {
      skipBeforeAndAfter = false,
      execaOptions,
      skipDefaults = false,
    }: { skipBeforeAndAfter?: boolean; execaOptions?: execa.Options; skipDefaults?: boolean } = {}
  ) {
    const hasComponentWithTheSameName = this.components.some(([name]) => name === cmpName);

    if (hasComponentWithTheSameName) {
      console.log(
        chalk.yellowBright`${chalk.bold`Warning:`} You already have this component name: ${chalk.bold(
          cmpName
        )}`
      );
    }

    if (!skipDefaults && ((execaOptions && !execaOptions.input) || !execaOptions)) {
      const defaults = [];

      if (
        !(
          args.includes('-t') ||
          args.includes('--type') ||
          args.includes('--function') ||
          args.includes('--class')
        )
      ) {
        defaults.push(`--${Types.FUNCTION}`);
      }

      if (
        !(
          args.includes('--scss') ||
          args.includes('--css') ||
          args.includes('--sass') ||
          args.includes('-s') ||
          args.includes('--style')
        )
      ) {
        defaults.push(`--${Styles.CSS}`);
      }

      if (defaults.length) {
        console.log(
          chalk.yellowBright`${chalk.bold`## WARNING:`} Adding default values to ${chalk.bold(
            cmpName
          )}. defaults: ${defaults}`
        );
      }

      args = [...args, ...defaults];
    }

    const componentDriver = componentTestkit(cmpName, {
      target: this.target,
      typescript: this.options.typescript,
      execaOptions,
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
    await this.cleanCache();

    this.components = [];
  }

  async cleanCache() {
    if (!this.options.skipCacheClean && (await this.hasConfig())) {
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
    return `${process.env.HOME}/.config/configstore/${this.name}.json`;
  }

  async hasConfig() {
    return (await exists(this.configPath)) && (await lstat(this.configPath)).isFile();
  }
}

export const tempProjectTestkit = (options: TempProjectDriver = {}) => new TempProject(options);
