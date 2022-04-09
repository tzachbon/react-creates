import expect from 'expect';
import { CliDriver } from './driver';

describe('cli', () => {
  const cli = new CliDriver().beforeAndAfter();

  it('should run CLI', async () => {
    const { output } = cli.runSync(['component', 'hello']);

    expect(output).toContain('Usage:');
  });
});
