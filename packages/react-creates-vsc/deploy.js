const execa = require('execa');
const isCI = require('is-ci')

const exe = ([first, ...args]) => {
  const { stdout, stderr } = execa.sync(first, [...args]);

  if (stdout) {
    console.log();
    console.log(stdout);
  }

  if (stderr) {
    console.log('############');
    console.error(stderr);
  }

};

exe(['npm', 'i', 'react-creates@latest']);

if (isCI) {
  exe(['npx', 'vsce', 'publish', 'patch']);
}
// exe(['git', 'add', 'package.json']);
// exe(['git', 'commit', '-m', `vsc: ${require('./package.json').version}`]);
