const execa = require("execa");
const { program } = require("commander");
const packageJson = require("./package");
const { writeFile } = require("fs/promises");
const { resolve } = require("path");

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

      // publish current version
      await execa("npm", ["publish"]);

      // update git with new version
      await execa("git", ["add", "package.json"]);
      await execa("git", [
        "commit",
        "-m",
        `":tada: New version created!" ${newVersion}`,
      ]);
      await execa("git", ["push"]);
    } catch (e) {
      throw e;
    }
  });

program.parse(process.argv);
