import expect from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('Typescript component', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('function (default)', () => {
    const files = cli.runSync(['component', componentName, '--yes']).loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('typescript-function');

    expect(files).toEqual(fixture);
  });

  it('class', () => {
    const files = cli
      .runSync(['component', componentName, '--type', 'class', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('typescript-class');

    expect(files).toEqual(fixture);
  });
});
