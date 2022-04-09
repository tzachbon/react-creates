import { nodeFs } from '@file-services/node';
import { program } from 'commander';
import { createComponent, ComponentOption } from '../../create-component';
import prompts from 'prompts';
import { FileSystemCache } from '../file-system-cache';

const propertiesOptions = {
  language: ['typescript', 'javascript'],
  type: ['function', 'class'],
  style: ['css', 'scss', 'none'],
};

export function createComponentCommand() {
  let optionsCache: FileSystemCache | undefined;
  return program
    .command('component <name>')
    .description('Creates react component')
    .option('-l --language <scripting>', 'Scripting language to use')
    .option('-d --directory <target>', 'Component directory', process.cwd())
    .option('-t --type <component>', 'Component type (function vs class)', 'function')
    .option('-pt --prop-types', 'Should add Prop-types if inside javascript project')
    .option('--skipTest|--skip-test', 'Will not create test file')
    .option('-s --style <styling>', 'Selected the style')
    .option('-y --yes', 'Selects the default values')
    .option('--fresh', 'Will not use cache')
    .action((name, options) =>
      createComponent(
        { name, ...options },
        {
          fileSystem: nodeFs,
          async resolveProperty(key) {
            if (options.yes) {
              return;
            }

            if (!optionsCache) {
              optionsCache = FileSystemCache.create({ fileSystem: nodeFs, rootDir: options.directory });
            }

            if (!options.fresh && optionsCache.get(key)) {
              return optionsCache.get<ComponentOption[typeof key]>(key);
            }

            if (!(key === 'style' || key === 'language' || key === 'type')) {
              return;
            }

            const values = [...propertiesOptions[key as keyof typeof propertiesOptions]];
            const response = await prompts({
              type: 'select',
              name: key,
              message: `Select component ${key}:`,
              choices: values.map((value) => ({ title: value, value })),
            });

            const value = response[key] as unknown as ComponentOption[typeof key];

            if (!options.fresh) {
              optionsCache.set(key, value);
            }

            return value;
          },
        }
      )
    );
}
