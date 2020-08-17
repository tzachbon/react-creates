import mockFs from 'mock-fs';
import { checkForMainDependencies } from '../../../src/utils/error';

const getMockFs = ({ havePackageJson = true }) => {


  let options = { havePackageJson }

  const start = () => {
    const mock = {
      'main': {
        'src': {
          'App.tsx': `import React from 'react'`
        }
      }
    }

    if (options.havePackageJson) {
      mock.main['package.json'] = `{
        "dependencies": {
          "react": "latest"
        }
      }`
    }

    mockFs(mock);
  }

  const reset = () => mockFs.restore();

  const beforeAndAfter = () => {
    beforeEach(start);
    afterEach(reset);
  }

  const updateProps = (newProps: any = {}) => {
    options = {
      ...options,
      ...newProps
    }

    reset();
    start();
  }

  return {
    start,
    reset,
    beforeAndAfter,
    updateProps,
    target: `main/src`
  }
}

describe('Error', () => {

  const mockDriver = getMockFs({});
  const { target } = mockDriver

  mockDriver.beforeAndAfter()

  describe('checkForMainDependencies', () => {

    it('should not fail', async () => {
      await expect(checkForMainDependencies({ target })).resolves.toMatchInlineSnapshot(`undefined`)
    })

    it('should fail', async () => {
      mockDriver.updateProps({ havePackageJson: false });
      await expect(checkForMainDependencies({ target })).rejects.toThrowError(/react/ig)
    })
  })

})
