import { fork } from 'child_process';
import { dirname } from 'path';

const extensionRootDir = dirname(require.resolve('react-creates-vscode/package.json'));

const child = fork(require.resolve('vsce/vsce'), ['publish', '--yarn'], {
  cwd: extensionRootDir,
  env: process.env,
  stdio: 'inherit',
});

child.on('error', (e) => {
  console.error(e);
  process.exitCode = 1;
});
