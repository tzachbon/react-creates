import mockFs from 'mock-fs';
import isTypescript from '../../../src/utils/is-typescript';

const mockFsDriver = ({
  packageJson = null,
  tsConfig = null,
  removeTsconfig = false,
  removePackageJson = false
} = {}) => {

  let options = { packageJson, tsConfig }

  const start = () => {
    const mock = {
      'main': {
        'src': {
          'App.tsx': `import React from 'react'`
        }
      }
    }

    if (!removeTsconfig) {
      mock.main['tsconfig.json'] = options.tsConfig ?? `{ }`;
    }

    if (!removePackageJson) {
      mock.main['package.json'] = options.packageJson ?? `
      {
          "dependencies": {
            "typescript": "3.8.0"
          },
          "devDependencies": {
            "typescript": "3.8.0"
          }
      }`
    }

    mockFs(mock);
  }

  const reset = () => mockFs.restore();

  const beforeAndAfter = () => {
    beforeAll(start);
    afterEach(reset);
  }

  const updateProps = (newOptions: any = {}) => {
    options = {
      ...options,
      ...newOptions
    }

    reset();
    start();

  }

  const getTarget = () => `main/src`;

  return {
    start,
    reset,
    beforeAndAfter,
    updateProps,
    getTarget
  }
}

describe('Is Typescript', () => {
  const driver = mockFsDriver();
  const target = driver.getTarget();

  driver.beforeAndAfter();

  it('should return true if has tsconfig and dependencies', async () => {
    expect(await isTypescript(target)).toBe(true)
  })

  it('should return true if has only dependencies', async () => {
    driver.updateProps({
      packageJson: `
      {
        "dependencies": {
          "typescript": "3.8.0"
        }
      }`
    });
    expect(await isTypescript(target)).toBe(true)
  })

  it('should return true if has only devDependencies', async () => {
    driver.updateProps({
      packageJson: `
      {
        "devDependencies": {
          "typescript": "3.8.0"
        }
      }`
    });
    expect(await isTypescript(target)).toBe(true)
  })

  it('should return false if doesn\'t have typescript in dependencies', async () => {
    driver.updateProps({
      packageJson: `
      {
        "devDependencies": {}
      }`
    });
    expect(await isTypescript(target)).toBe(false)

    driver.updateProps({
      packageJson: `
      {
        "dependencies": {}
      }`
    });
    expect(await isTypescript(target)).toBe(false)
  })

  it('should return false if doesn\'t have package.json', async () => {
    driver.updateProps({ removePackageJson: true });

    expect(await isTypescript(target)).toBe(false)
  })


  it('should return false if doesn\'t have tsconfig.json', async () => {
    driver.updateProps({ removeTsconfig: true });

    expect(await isTypescript(target)).toBe(false)
  })


})
