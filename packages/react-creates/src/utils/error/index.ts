import chalk from "chalk";

export const checkForMainDependencies = () => {
  let foo, error;
  try {
    foo = require("react");
  } catch (err) {
    error = err;
  }

  if (!foo) {
    console.error(
      chalk.red(`
      Missing ${chalk.bold("react")} dependence.
      This CLI is made for react project 😎 ⚛
    `)
    );

    throw error;
  }
};
