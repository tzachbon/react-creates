const execa = require("execa");
const { program } = require("commander");
const packageJson = require("./package");
const fs = require("fs");
const { promisify } = require("util");
const { resolve } = require("path");

const writeFile = promisify(fs.writeFile);

const updateIndex = {
  major: 0,
  minor: 1,
  patch: 2,
};

program
  .option("-m --minor")
  .option("-p --patch")
  .action(async (_) => {
    try {
      const { major, minor, patch } = _.opts();

      const version = packageJson.version.split(".").map((_) => parseInt(_));

      for (const [versionKey, shouldUpdate] of Object.entries({
        major,
        minor,
        patch,
      })) {
        if (shouldUpdate) {
          version[updateIndex[versionKey]]++;
        }
      }

      const newVersion = version.join(".");
      packageJson.version = newVersion;

      // update package.json
      await writeFile(
        resolve("package.json"),
        JSON.stringify(packageJson, null, 2)
      );
      console.log('### Updating package.json');
      

      // publish current version
      await execa("npm", ["publish"]);
      console.log('### Publishing to npm');

      // update git with new version
      await execa("git", ["add", "package.json"]);
      console.log('### Git: adding package.json');
      await execa("git", [
        "commit",
        "-m",
        `":tada: New version created!" ${newVersion}`,
      ]);
      console.log('### Git: committing');
      await execa("git", ["push"]);
      console.log('### Git: pushing 🥳');

    } catch (e) {
      console.error(e);
      throw e;
    }
  });

program.parse(process.argv);
