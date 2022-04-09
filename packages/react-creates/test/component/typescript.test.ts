import expect from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('Typescript component', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('function (default)', async () => {
    const files = cli
      .runSync(['component', componentName, '--type', 'function', '--language', 'typescript'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('typescript-function');

    expect(files).toEqual(fixture);
  });

  it('class', async () => {
    const files = cli
      .runSync(['component', componentName, '--type', 'class', '--language', 'typescript'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('typescript-class');

    expect(files).toEqual(fixture);
  });
});
