import expect from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('general', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('skip-test', async () => {
    const files = cli
      .runSync(['component', componentName, '--type', 'function', '--language', 'typescript', '--skip-test'])
      .loadDirectorySync(componentName);

    const fixture = CliDriver.loadFixtureSync('skip-test');

    expect(files).toEqual(fixture);
  });
});
