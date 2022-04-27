import expect from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('general', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('skip-test', () => {
    const files = cli.runSync(['component', componentName, '--skip-test', '--yes']).loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('skip-test');

    expect(files).toEqual(fixture);
  });
});
