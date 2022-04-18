import { fork } from 'child_process';
import { dirname } from 'path';

const extensionPackageJsonPath = require.resolve('react-creates-vsc/package.json');
const extensionRootDir = dirname(extensionPackageJsonPath);
const vsce = require.resolve('vsce/vsce');

const child = fork(vsce, ['publish', '--yarn'], {
  cwd: extensionRootDir,
  env: process.env,
  stdio: 'inherit',
});

child.on('error', (e) => {
  console.log(`Failed to publish the extension.`);
  console.error(e);
  process.exitCode = 1;
});
