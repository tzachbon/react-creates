import { program } from 'commander';
import getConfig from '../../utils/config';
import chalk from 'chalk';
import { existsSync } from 'fs';

export const cleanCache = () =>
  program
    .command('clean-cache')
    .description('Clean cache file')
    .option('-d --directory <target>', 'Component directory', process.cwd())
    .action(async (_) => {
      const { directory: target } = _.opts();

      try {
        const config = await getConfig({ target, skipCache: true });

        if (!existsSync(config.path)) {
          console.warn(
            chalk.yellow`We did not find any config file for this name: ${chalk.bold(config.name)}`
          );
        } else {
          config.clean();
          console.log(chalk.green`Cache cleaned from ${chalk.bold(config.name)}!`);
        }

        console.log('Cache path: ' + config.path);
      } catch (e) {
        console.error(
          chalk.red`Failed to clean cache, please make sure you have ${chalk.bold`package.json`}`
        );
        throw e;
      }
    });
