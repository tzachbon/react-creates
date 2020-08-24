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

    const secondComponent = await driver.createComponent('SecondComponent');

    expect(await secondComponent.isStyleMatch(Styles.SCSS)).toBe(true);
    expect(await secondComponent.getFiles()).not.toContain(`style.${Styles.CSS}`);
  });

  it.skip('should skip cache values', async () => {
    const currentStyle = Styles.SCSS;
    const newStyle = Styles.SASS;

    const firstComponent = await driver.createComponent('FirstComponent', [
      '-s',
      currentStyle,
      `--${Types.FUNCTION}`,
    ]);

    expect(await firstComponent.isStyleMatch(currentStyle)).toBe(true);
    expect(await driver.hasConfig()).toBe(true);

    const cache = JSON.parse(readFileSync(driver.configPath, 'utf8'));

    expect(cache.style).toEqual(currentStyle);

    const secondComponent = await driver.createComponent(
      'SecondComponent',
      [`--${Types.FUNCTION}`, '--skip-cache'],
      {
        execaOptions: { input: newStyle },
      }
    );

    expect(await secondComponent.getFiles()).not.toContain(`style.${currentStyle}`);
    expect(await secondComponent.getFiles()).toContain(`style.${newStyle}`);
  });
});
