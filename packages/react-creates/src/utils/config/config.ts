import Configstore from 'configstore';
import getPackageJson from '../get-package-json';
import { isString, isNil } from 'lodash';
import { ReactCreatesConfig, ConfigCreateParams, ConfigParams } from './types';

export const getConfig = async (options: ConfigCreateParams) => await Config.create(options);

export class Config {
  store: Configstore;
  target: string;
  name: string;
  reactCreates: ReactCreatesConfig;

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

  private constructor({ target, packageJson }: ConfigParams) {
    this.target = target;
    this.name = packageJson?.name as string;

    if (isNil(packageJson)) {
      throw new Error(`We looked everywhere for you package json, where the hell is it?`);
    } else if (!isString(this.name)) {
      throw new Error(`You must have 'name' property inside your package json`);
    }

    this.reactCreates = packageJson['react-creates'];
    this.store = new Configstore(this.name);
  }

  set<T = any>(key: string, value: T) {
    this.store.set(key, value);
    return value;
  }

  get<T = any>(key: string): T {
    return (this.store.get(key) ?? this.reactCreates?.[key]) as T;
  }

  has(key): boolean {
    return Boolean(this.get(key));
  }

  clean() {
    this.store.clear()
  }
}
