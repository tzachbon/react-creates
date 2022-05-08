import { program } from 'commander';
import { clearCacheCommand } from './commands/clear-cache';
import { createComponentCommand } from './commands/create-component';

async function run() {
  await program
    .version('1.0.0')
    .usage('<command> [options]')
    .allowUnknownOption(false)
    .addCommand(createComponentCommand())
    .addCommand(clearCacheCommand())
    .parseAsync(process.argv);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
