import expect from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('Javascript component', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('function', async () => {
    const files = cli
      .runSync(['component', componentName, '--language', 'javascript', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('javascript-function');

    expect(files).toEqual(fixture);
  });

  it('function (prop-type)', async () => {
    const files = cli
      .runSync(['component', componentName, '--language', 'javascript', '--prop-types', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('javascript-function-prop-types');

    expect(files).toEqual(fixture);
  });

  it('class', async () => {
    const files = cli
      .runSync(['component', componentName, '--type', 'class', '--language', 'javascript', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('javascript-class');

    expect(files).toEqual(fixture);
  });

  it('class (prop-types)', async () => {
    const files = cli
      .runSync(['component', componentName, '--type', 'class', '--language', 'javascript', '--prop-types', '--yes'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('javascript-class-prop-types');

    expect(files).toEqual(fixture);
  });
});
