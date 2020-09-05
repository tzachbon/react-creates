import { tempProjectTestkit } from '../testkit/create-react-app.testkit';
import { Component } from '../testkit/component.testkit';

describe('Dry Run', () => {
  let cmpDriver: Component;
  const driver = tempProjectTestkit().beforeAndAfter();

  it('should not create files', async () => {
    cmpDriver = await driver.createComponent('DryRunComponent', ['--dry-run']);

    await expect(cmpDriver.getFiles()).rejects.toThrowError(/DryRunComponent/);

    cmpDriver = await driver.createComponent('DryRunComponent');

    await expect(cmpDriver.isStyleMatch()).resolves.toEqual(true);
  });
});
