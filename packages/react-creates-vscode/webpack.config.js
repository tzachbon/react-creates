//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
module.exports = {
  mode: 'production',
  target: 'webworker', // vscode extensions run in webworker context for VS Code web 📖 -> https://webpack.js.org/configuration/target/#target
  entry: './dist/src/main.js', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
    extensions: ['.js'],
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      util: require.resolve('util/'),
      path: require.resolve('path-browserify'),
      process: false,
      fs: false,
    },
  },
};
