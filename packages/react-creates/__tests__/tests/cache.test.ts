import { tempProjectTestkit } from '../testkit/create-react-app.testkit';
import { Styles } from '../../src/scripts/component/parsers/parse-style';
import { Types } from '../../src/scripts/component/parsers/parse-type';

describe('Caching mechanism', () => {
  const driver = tempProjectTestkit({ skipCacheClean: true }).beforeAndAfterAll();

  it('should cache values', async () => {
    const firstComponent = await driver.createComponent('FirstComponent', ['-s', Styles.SCSS, `--${Types.FUNCTION}`]);

    expect(await firstComponent.isStyleMatch(Styles.SCSS)).toBe(true);

    const secondComponent = await driver.createComponent('SecondComponent');

    expect(await secondComponent.isStyleMatch(Styles.SCSS)).toBe(true);
    expect(await secondComponent.getFiles()).not.toContain(`style.${Styles.CSS}`);
  });
});
