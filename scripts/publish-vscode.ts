import { fork, spawnSync } from 'child_process';
import { dirname } from 'path';

const extensionPackageJsonPath = require.resolve('react-creates-vsc/package.json');
const extensionRootDir = dirname(extensionPackageJsonPath);
const extensionId = 'TzachBonfil.react-creates-vsc';
const vsce = require.resolve('vsce/vsce');

const extensionData = JSON.parse(spawnSync(vsce, ['show', extensionId, '--json']).stdout.toString());
const latestVersion = extensionData.versions[0] as { version: string; flags: number; lastUpdated: string };
const extensionCurrentVersion = require(extensionPackageJsonPath).version;

if (latestVersion !== extensionCurrentVersion) {
  console.log(`Updating extension from ${latestVersion.version} to ${extensionCurrentVersion}`);

  const child = fork(vsce, ['publish', '--yarn'], {
    cwd: extensionRootDir,
    env: process.env,
    stdio: 'inherit',
  });

  child.on('error', (e) => {
    console.log(`Failed to update the extension.`);
    console.error(e);
    process.exitCode = 1;
  });
} else {
  console.log(`"${extensionId}" is up to date (${extensionCurrentVersion})`);
}
