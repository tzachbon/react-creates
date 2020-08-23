const execa = require('execa');
const packageJson = require('./package.json');

execa.sync('git', ['add', 'package.json']);
execa.sync('git', ['commit', '-m', `vsc: ${packageJson.version}`]);