import execa from 'execa';
import { program } from 'commander';

export const getVersionRaw = async () => {
  const { stdout: version } = await execa('npm', 'info react-creates version'.split(' '));

  return version;
};

export const getVersion = () =>
  program
    .command('version')
    .description('Get current version')
    .action(async (_) => {
      console.log(await getVersionRaw());
    });
