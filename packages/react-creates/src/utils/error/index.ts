import chalk from 'chalk';
import getPackageJson from '../get-package-json';

export const checkForMainDependencies = async ({ target = process.cwd() } = {}) => {
  const { dependencies, devDependencies } = (await getPackageJson({ cwd: target })) || {};

  const hasReact = Boolean(dependencies?.['react'] || devDependencies?.['react']);

  if (!hasReact) {
    throw new Error(`
    Missing ${chalk.bold('React')} dependence.
    This CLI is made for react project 😎 ⚛
  `);
  }
};
