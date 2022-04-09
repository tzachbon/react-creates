import { program } from 'commander';
import { createComponentCommand } from './create-component-command';

async function run() {
  await program
    .version('0.0.1')
    .usage('<command> [options]')
    .addHelpCommand()
    .addCommand(createComponentCommand())
    .parseAsync(process.argv);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
