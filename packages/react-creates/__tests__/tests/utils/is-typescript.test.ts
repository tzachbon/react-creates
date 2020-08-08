import mockFs from 'mock-fs';
import isTypescript from '../../../src/utils/is-typescript';

const fsMockDriver = ({ packageJson = null, tsConfig = null } = {}) => {

  let options = { packageJson, tsConfig }

  const start = () => mockFs({
    'main': {
      'tsconfig.json': options.tsConfig ?? `{ }`,
      'package.json': options.packageJson ?? `
      {
          "version": "1.0.0",
          "scripts": {
            "test": "npx jest"
          },
          "dependencies": {
            "typescript": "3.8.0"
          },
          "devDependencies": {
            "typescript": "3.8.0"
          }
      }`,
      'src': {
        'App.tsx': `import React from 'react';
            import logo from './logo.svg';
            import './App.css';
            
            function App() {
              return (
                <div className="App">
                  <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                      Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                      className="App-link"
                      href="https://reactjs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn React
                    </a>
                  </header>
                </div>
              );
            }
            
            export default App;
            `
      }
    }
  })

  const reset = () => mockFs.restore();

  const beforeAndAfter = () => {
    beforeAll(start);
    afterEach(reset);
  }

  const updateProps = (newOptions: any) => {
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
  const driver = fsMockDriver();

  driver.beforeAndAfter();

  it('should return true if has tsconfig and dependencies', async () => {
    const target = driver.getTarget();
    expect(await isTypescript(target)).toBe(true)

  })


})
