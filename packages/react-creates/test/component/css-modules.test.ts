import { expect } from 'expect';
import { CliDriver } from '../driver';

const componentName = 'Component';

describe('CSS Modules', () => {
  const cli = new CliDriver().beforeAndAfter();

  describe('style', () => {
    it('should throw when style is not css or scss', () => {
      const { output, error } = cli.runSync(['component', componentName, '--css-modules', '--yes']);

      expect(output).toEqual('');
      expect(error).toContain('Error: Cannot use CSS Modules with style "none", only "css" and "scss" are supported');
    });

    it('css', () => {
      const files = cli
        .runSync(['component', componentName, '--style', 'css', '--css-modules', '--yes'])
        .loadDirectorySync(componentName);

      expect(files[`style.module.css`]).toEqual(`.${componentName} {}`);
    });

    it('scss', () => {
      const files = cli
        .runSync(['component', componentName, '--style', 'scss', '--css-modules', '--yes'])
        .loadDirectorySync(componentName);

      expect(files[`style.module.scss`]).toEqual(`.${componentName} {}`);
    });
  });

  describe('Javascript', () => {
    it('function', () => {
      const files = cli
        .runSync([
          'component',
          componentName,
          '--language',
          'javascript',
          '--type',
          'function',
          '--style',
          'css',
          '--css-modules',
          '--yes',
        ])
        .loadDirectorySync(componentName);

      expect(files[`${componentName}.js`]).toContain(`import classes from './style.module.css';`);
      expect(files[`${componentName}.js`]).toContain(`className={classes.${componentName}}`);
      expect(files[`style.module.css`]).toEqual(`.${componentName} {}`);
    });

    it('class', () => {
      const files = cli
        .runSync([
          'component',
          componentName,
          '--language',
          'javascript',
          '--type',
          'class',
          '--style',
          'css',
          '--css-modules',
          '--yes',
        ])
        .loadDirectorySync(componentName);

      expect(files[`${componentName}.js`]).toContain(`import classes from './style.module.css';`);
      expect(files[`${componentName}.js`]).toContain(`className={classes.${componentName}}`);
      expect(files[`style.module.css`]).toEqual(`.${componentName} {}`);
    });
  });

  describe('Typescript', () => {
    it('function', () => {
      const files = cli
        .runSync([
          'component',
          componentName,
          '--language',
          'typescript',
          '--type',
          'function',
          '--style',
          'css',
          '--css-modules',
          '--yes',
        ])
        .loadDirectorySync(componentName);

      expect(files[`${componentName}.tsx`]).toContain(`import classes from './style.module.css';`);
      expect(files[`${componentName}.tsx`]).toContain(`className={classes.${componentName}}`);
      expect(files[`style.module.css`]).toEqual(`.${componentName} {}`);
    });

    it('class', () => {
      const files = cli
        .runSync([
          'component',
          componentName,
          '--language',
          'typescript',
          '--type',
          'class',
          '--style',
          'css',
          '--css-modules',
          '--yes',
        ])
        .loadDirectorySync(componentName);

      expect(files[`${componentName}.tsx`]).toContain(`import classes from './style.module.css';`);
      expect(files[`${componentName}.tsx`]).toContain(`className={classes.${componentName}}`);
      expect(files[`style.module.css`]).toEqual(`.${componentName} {}`);
    });
  });
});
