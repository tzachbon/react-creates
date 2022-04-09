import { nodeFs } from '@file-services/node';
import { program } from 'commander';
import { createComponent, ComponentOption } from '../create-component';
import prompts from 'prompts';

const propertiesOptions = {
  language: ['typescript', 'javascript'],
  type: ['function', 'class'],
  style: ['css', 'scss', 'none'],
};

export function createComponentCommand() {
  return program
    .usage('<command> [options]')
    .command('component <name>')
    .description('Creates react component')
    .option('-l --language <scripting>', 'Scripting language to use')
    .option('-d --directory <target>', 'Component directory', process.cwd())
    .option('-t --type <component>', 'Component type (function vs class)', 'function')
    .option('-pt --prop-types', 'Should add Prop-types if inside javascript project')
    .option('--skipTest|--skip-test', 'Will not create test file')
    .option('-s --style <styling>', 'Selected the style')
    .action((name, options) =>
      createComponent(
        { name, ...options },
        {
          fileSystem: nodeFs,
          async resolveProperty(key) {
            if (key === 'style' || key === 'language' || key === 'type') {
              const values = [...propertiesOptions[key as keyof typeof propertiesOptions]];
              const response = await prompts({
                type: 'select',
                name: key,
                message: `Select component ${key}:`,
                choices: values.map((value) => ({ title: value, value })),
              });

              return response[key] as unknown as ComponentOption[typeof key];
            } else {
              return;
            }
          },
        }
      )
    );
}
