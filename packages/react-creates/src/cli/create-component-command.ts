import { nodeFs } from '@file-services/node';
import { program } from 'commander';
import { createComponent } from '../create-component';

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
    .action((name, options) => createComponent({ name, ...options }, { fileSystem: nodeFs }));
}
