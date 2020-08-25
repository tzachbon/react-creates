import find from 'find-package-json';

export default async function getPackageJson({ cwd = process.cwd() } = {}) {
  return find(cwd).next().value;
}
