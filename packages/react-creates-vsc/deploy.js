const execa = require('execa');
const packageJson = require('./package.json');

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
exe(['npx', 'vsce', 'publish', 'patch']);
exe(['git', 'add', 'package.json']);
exe(['git', 'commit', '-m', `vsc: ${packageJson.version}`]);
