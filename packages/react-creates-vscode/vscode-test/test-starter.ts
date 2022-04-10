import { runTests } from '@vscode/test-electron';
import { dirname, join } from 'path';

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = dirname(require.resolve('react-creates-vsc/package.json'));

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = join(__dirname, './test-runner');

    // Fixtures to open
    const fixtures = join(__dirname, '..', 'fixtures');

    // Download VS Code, unzip it and run the integration test
    await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs: ['--disable-extensions', fixtures] });
  } catch (err) {
    console.error('Failed to run tests', err);
    process.exit(1);
  }
}

main();
