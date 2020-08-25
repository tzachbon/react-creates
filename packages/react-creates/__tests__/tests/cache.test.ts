import { tempProjectTestkit } from '../testkit/create-react-app.testkit';
import { Styles } from '../../src/scripts/component/parsers/parse-style';
import { Types } from '../../src/scripts/component/parsers/parse-type';
import { readFileSync } from 'fs';

describe('Caching mechanism', () => {
  const driver = tempProjectTestkit().beforeAndAfter();

  it('should cache values', async () => {
    const firstComponent = await driver.createComponent('FirstComponent', [
      '-s',
      Styles.SCSS,
      `--${Types.FUNCTION}`,
    ]);

    expect(await firstComponent.isStyleMatch(Styles.SCSS)).toBe(true);
    expect(await driver.hasConfig()).toBe(true);

    const secondComponent = await driver.createComponent('SecondComponent', [], {
      skipDefaults: true,
    });

    expect(await secondComponent.isStyleMatch(Styles.SCSS)).toBe(true);
    expect(await secondComponent.getFiles()).not.toContain(`style.${Styles.CSS}`);
  });

  it('should override cache value', async () => {
    const newValue = Styles.SCSS;
    const oldValue = Styles.SASS;

    const firstComponent = await driver.createComponent('FirstComponent', [
      `--${oldValue}`,
      `--${Types.FUNCTION}`,
    ]);

    expect(await firstComponent.isStyleMatch(oldValue)).toBe(true);
    expect(await driver.hasConfig()).toBe(true);

    expect(JSON.parse(readFileSync(driver.configPath, 'utf8')).style).toEqual(oldValue);

    const secondComponent = await driver.createComponent('SecondComponent', [
      `--${newValue}`,
      `--${Types.FUNCTION}`,
    ]);

    expect(await secondComponent.isStyleMatch(newValue)).toBe(true);
    expect(await driver.hasConfig()).toBe(true);

    expect(JSON.parse(readFileSync(driver.configPath, 'utf8')).style).toEqual(newValue);
  });

  it.skip('should ignore cache values', async () => {
    const currentStyle = Styles.SCSS;
    const newStyle = Styles.SASS;

    const firstComponent = await driver.createComponent('FirstComponent', [
      `--${currentStyle}`,
      `--${Types.FUNCTION}`,
    ]);

    expect(await firstComponent.isStyleMatch(currentStyle)).toBe(true);
    expect(await driver.hasConfig()).toBe(true);

    const cache = JSON.parse(readFileSync(driver.configPath, 'utf8'));

    expect(cache.style).toEqual(currentStyle);

    const secondComponent = await driver.createComponent(
      'SecondComponent',
      [`--${Types.FUNCTION}`, '--ignore-cache'],
      {
        execaOptions: { input: newStyle },
      }
    );

    expect(await secondComponent.getFiles()).not.toContain(`style.${currentStyle}`);
    expect(await secondComponent.getFiles()).toContain(`style.${newStyle}`);
  });

  it('should not save cache', async () => {
    await driver.createComponent('FirstComponent', [
      '-s',
      Styles.SCSS,
      `--${Types.FUNCTION}`,
      '--skip-cache',
    ]);

    expect(await driver.hasConfig()).toBe(false);
  });
});
