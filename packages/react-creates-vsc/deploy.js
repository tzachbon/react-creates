const execa = require('execa');
const packageJson = require('./package.json');

const exe = ([first, ...args]) => execa(first, [...args]).stdout.pipe(process.stdout);

async function main() {
  await exe(['npm', 'i', 'react-creates@latest']);
  await exe(['npx', 'vsce', 'publish', 'patch']);
  await exe(['git', 'add', 'package.json']);
  await exe(['git', 'commit', '-m', `vsc: ${packageJson.version}`]);
}

try {
  main();
} catch (e) {
  throw e;
}