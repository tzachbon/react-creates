import { program } from 'commander';
import { createComponentCommand } from './create-component-command';

async function run() {
  await program
    .version('1.0.0')
    .allowUnknownOption(false)
    .addCommand(createComponentCommand())
    .parseAsync(process.argv);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
