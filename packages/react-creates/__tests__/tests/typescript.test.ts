import { tempProjectTestkit, TempProject } from '../testkit/create-react-app.testkit';
import { Component } from '../testkit/component.testkit';
import { Language } from '../../src/scripts/component/parsers/parse-language';

describe('Is Typescript', () => {
  let cmpDriver: Component;
  const driver = tempProjectTestkit({ typescript: true }).beforeAndAfter();

  it('should have typescript files without using flags', async () => {
    cmpDriver = await driver.createComponent('TsComponent');

    const files = await cmpDriver.getFiles();

    expect(files).toContain(`${cmpDriver.name}.tsx`);
  });

  it('should have javascript project with flag', async () => {
    cmpDriver = await driver.createComponent('TsComponentWithJs', ['-l', Language.JAVASCRIPT]);

    const files = await cmpDriver.getFiles();

    expect(files).not.toContain(`${cmpDriver.name}.tsx`);
    expect(files).toContain(`${cmpDriver.name}.js`);
  });
});
