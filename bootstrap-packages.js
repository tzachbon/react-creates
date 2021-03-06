const fs = require('fs/promises');
const path = require('path');
const execa = require('execa');
const isCi = require('is-ci');

(async () => {
  if (isCi) {
    const packageBasePath = path.join(__dirname, 'packages');
    const packagesNames = await fs.readdir(packageBasePath);
    const packagesPathes = packagesNames.map(name => path.join(packageBasePath, name));

    for (const packagePath of packagesPathes) {
      execa('npm', ['ci'], { cwd: packagePath })
        .stdout
        .pipe(process.stdout)
    }
  } else {
    execa('npm', 'run bootstrap'.split(' '))
      .stdout
      .pipe(process.stdout);
  }
})()
