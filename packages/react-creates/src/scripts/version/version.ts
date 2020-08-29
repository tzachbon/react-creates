import getPackageJson from '../../utils/get-package-json';
import { program } from 'commander';

export const getVersionRaw = async () => {
  const { version } = (await getPackageJson()) || {};

  return version;
};

export const getVersion = () =>
  program
    .command('version')
    .description('Get current version')
    .action(async (_) => {
      console.log(await getVersionRaw());
    });
