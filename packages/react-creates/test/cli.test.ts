import expect from 'expect';
import { CliDriver } from './driver';

describe('cli', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('should run CLI', async () => {
    const componentName = 'Component';
    const files = cli.runSync(['component', componentName]).loadDirectorySync(componentName);
    const fixture = CliDriver.loadFixtureSync('default-template');

    expect(files).toEqual(fixture);
  });
});
