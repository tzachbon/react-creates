const { program } = require("commander");
const packageJson = require("./package");
const fs = require("fs");
const { promisify } = require("util");
const { resolve } = require("path");
const chalk = require("chalk");
const execa = require("execa");

const writeFile = promisify(fs.writeFile);

const updateIndex = {
  major: 0,
  minor: 1,
  patch: 2,
};

program
  .option("-m --minor")
  .option("-p --patch")
  .option("-t --tag")
  .option("-g --git")
  .action(async (_) => {
    try {
      const { major, minor, patch, git, tag } = _.opts();

      const version = packageJson.version.split(".").map((_) => parseInt(_));
      const message = `New react-scripts version: \`${packageJson.version}\``;

      if (tag) {
        await execa("git", ["tag", `v${packageJson.version}`]);
      }

      if (git) {
        await execa("git", ["add", "."]);
        await execa("git", ["commit", "-m", message]);
        await execa("git", ["push"]);

        console.log(
          chalk.green(
            `
            Git commit created successfully
          `
          )
        );

        return;
      }

      let versionType;
      for (const [versionKey, shouldUpdate] of Object.entries({
        major,
        minor,
        patch,
      })) {
        if (shouldUpdate) {
          version[updateIndex[versionKey]]++;
          versionType = versionKey.charAt(0);
        }
      }

      const newVersion = version.join(".");
      packageJson.version = newVersion;

      // update package.json
      await writeFile(
        resolve("package.json"),
        JSON.stringify(packageJson, null, 2)
      );
      console.log(
        chalk.green(
          "### Updated package.json, version: " + chalk.bold(newVersion)
        )
      );

      if (versionType) {
        await execa("npm", ["run", "version", `-${versionType}`]);
        console.log(chalk.blueBright`Change log updated 🕓`);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

program.parse(process.argv);
