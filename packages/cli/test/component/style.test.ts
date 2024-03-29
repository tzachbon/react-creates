import { expect } from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('Style', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('no style specified', () => {
    const files = cli.runSync(['component', componentName, '--yes']).loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('no-style-specified');

    expect(files).toEqual(fixture);
  });

  it('none', () => {
    const files = cli
      .runSync(['component', componentName, '--style', 'none', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('style-none');

    expect(files).toEqual(fixture);
  });

  it('css', () => {
    const files = cli.runSync(['component', componentName, '--style', 'css', '--yes']).loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('style-css');

    expect(files).toEqual(fixture);
  });

  it('scss', () => {
    const files = cli
      .runSync(['component', componentName, '--style', 'scss', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('style-scss');

    expect(files).toEqual(fixture);
  });
});
