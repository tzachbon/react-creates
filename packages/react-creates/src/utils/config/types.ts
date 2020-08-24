import { Optional } from 'utility-types';
import { CreateComponentOptions } from '../../scripts/component/types';
import { Config } from '.';
import finder from 'find-package-json';

export interface ConfigCreateParams {
  target: string;
  skipCache?: boolean
}

export interface ConfigParams extends ConfigCreateParams {
  packageJson: finder.Package;
}

export interface WithConfig {
  config: Config;
  ignoreCache?: boolean;
}

export type ReactCreatesConfig = Optional<CreateComponentOptions> | null;
