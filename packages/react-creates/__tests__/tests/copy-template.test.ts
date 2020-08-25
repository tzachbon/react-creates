import { tempProjectTestkit } from '../testkit/create-react-app.testkit';
import { Component } from '../testkit/component.testkit';
import { Language } from '../../src/scripts/component/parsers/parse-language';

describe('Copy Template', () => {
  let cmpDriver: Component;
  const driver = tempProjectTestkit().beforeAndAfter();

  it('should create test file', async () => {
    cmpDriver = await driver.createComponent('ComponentWithTest');

    const files = await cmpDriver.getFiles();

    expect(files).toContain(`${cmpDriver.name}.test.js`);
  });

  it('should not create test file', async () => {
    cmpDriver = await driver.createComponent('ComponentWithTest', ['--skip-test']);

    const files = await cmpDriver.getFiles();

    expect(await cmpDriver.isStyleMatch()).toBe(true);
    expect(files).toContain(`${cmpDriver.name}.js`);
    expect(files).not.toContain(`${cmpDriver.name}.test.js`);
  });

  it('should not create test file (ts)', async () => {
    cmpDriver = await driver.createComponent('ComponentWithTest', [
      '--skip-test',
      '-l',
      Language.TYPESCRIPT,
    ]);

    const files = await cmpDriver.getFiles();

    expect(await cmpDriver.isStyleMatch()).toBe(true);
    expect(files).toContain(`${cmpDriver.name}.tsx`);
    expect(files).not.toContain(`${cmpDriver.name}.test.tsx`);
  });
});
