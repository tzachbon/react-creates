import { Optional } from 'utility-types';
import { CreateComponentOptions } from '../../scripts/component/types';
import { PackageJsonType } from '../get-package-json';
import { Config } from '.';

export interface ConfigCreateParams {
  target: string;
}

export interface ConfigParams extends ConfigCreateParams {
  packageJson: PackageJsonType;
}

export interface WithConfig {
  config: Config
}

export type ReactCreatesConfig = Optional<CreateComponentOptions> | null