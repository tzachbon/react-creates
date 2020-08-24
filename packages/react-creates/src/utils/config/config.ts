import Configstore from 'configstore';
import getPackageJson from '../get-package-json';
import { isString, isNil } from 'lodash';
import { ReactCreatesConfig, ConfigCreateParams, ConfigParams } from './types';
import { existsSync, unlinkSync } from 'fs';

export const getConfig = async (options: ConfigCreateParams) => await Config.create(options);

export class Config implements ConfigCreateParams {
  store: Configstore | undefined;
  target: string;
  name: string;
  reactCreates: ReactCreatesConfig;
  skipCache: boolean;

  static async create(options: ConfigCreateParams) {
    const { target } = options;
    const packageJson = await getPackageJson({
      cwd: target,
    });

    return new Config({
      ...options,
      packageJson,
    });
  }

  static getConfigPath(name: string) {
    return `${process.env.HOME}/.config/configstore/${name}.json`;
  }

  static clean(name: string) {
    const path = Config.getConfigPath(name);

    if (existsSync(path)) {
      unlinkSync(path);
    }
  }

  private constructor({ target, packageJson, skipCache }: ConfigParams) {
    this.target = target;
    this.name = packageJson?.name as string;
    this.skipCache = skipCache;

    if (isNil(packageJson)) {
      throw new Error(`We looked everywhere for you package json, where the hell is it?`);
    } else if (!isString(this.name)) {
      throw new Error(`You must have 'name' property inside your package json`);
    }

    this.reactCreates = packageJson['react-creates'];

    if (!skipCache) {
      this.store = new Configstore(this.name);
    }
  }

  get path() {
    return Config.getConfigPath(this.name);
  }

  set<T = any>(key: string, value: T) {
    this.store?.set(key, value);

    return value;
  }

  get<T = any>(key: string): T {
    return (this.store?.get(key) ?? this.reactCreates?.[key]) as T;
  }

  has(key): boolean {
    return Boolean(this.get(key));
  }

  clean() {
    this.store?.clear();
    Config.clean(this.name);
  }
}
