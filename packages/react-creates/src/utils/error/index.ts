import chalk from "chalk";
import getPackageJson from '../get-package-json';

export const checkForMainDependencies = async ({ target = process.cwd() } = {}) => {

  const { dependencies } = await getPackageJson({ cwd: target, depth: 9999 }) || {}

  const hasReact = Boolean(dependencies?.['react'])

  if (!hasReact) {
    throw new Error(`
    Missing ${chalk.bold("React")} dependence.
    This CLI is made for react project 😎 ⚛
  `);
  }
};
