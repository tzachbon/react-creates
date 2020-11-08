const execa = require('execa');
const isCI = require('is-ci');
const fs = require('fs/promises');
const path = require('path');

const packAgeJsonPath = path.join(__dirname, 'package.json');

const exe = ([first, ...args]) => {
  const { stdout, stderr } = execa.sync(first, [...args]);

  if (stdout) {
    console.log();
    console.log(stdout);
  }

  if (stderr) {
    console.log('############');
    console.error(stderr);
  }

};

const fetchVersion = async () => {
  const { stdout } = await execa('npx', 'vsce show --json TzachBonfil.react-creates-vsc'.split(' '));

  const { versions } = JSON.parse(stdout);

  return versions[0].version
}

const getPackageJson = async () => {
  const packageJsonString = await fs.readFile(packAgeJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonString);

  return packageJson;
}

(async () => {

  if (isCI) {

    const version = await fetchVersion();

    let packageJson = await getPackageJson();

    packageJson.version = version

    await fs.writeFile(packAgeJsonPath, JSON.stringify(packageJson, null, 2));

    exe(['npx', 'vsce', 'publish', 'patch', '-p', process.env.VSC_TOKEN]);
  } else {
    console.log('Can not deploy when not in CI');
  }

  packageJson = await getPackageJson();
  console.log('Current version: ' + packageJson.version);
})()
