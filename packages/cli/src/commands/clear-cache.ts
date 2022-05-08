import { nodeFs } from '@file-services/node';
import { program } from 'commander';
import { FileSystemCache } from '../file-system-cache';

export function clearCacheCommand() {
  return program
    .command('clear-cache')
    .description('Clear cache file')
    .option('-d --directory <directory>', 'Root directory to clear cache')
    .action(({ directory: rootDir }) => {
      const deleted = FileSystemCache.delete({ fileSystem: nodeFs, rootDir });

      if (deleted) {
        console.log('Cache file deleted');
      } else {
        console.log('Cache file not found');
      }
    });
}
