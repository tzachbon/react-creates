import find from 'find-package-json';

export default function getPackageJson({ cwd = process.cwd() } = {}) {
  return Promise.resolve(find(cwd).next().value);
}
