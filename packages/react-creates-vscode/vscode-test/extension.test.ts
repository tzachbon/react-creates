import { nodeFs } from '@file-services/node';
import expect from 'expect';
import { describe, it } from 'mocha';
import { join } from 'path';
import * as vscode from 'vscode';

const fixturePath = join(__dirname, '..', 'fixtures', 'javascript-app');

describe('Extension Test Suite', () => {
  it('Sample test', async () => {
    const componentName = 'MyComponent';

    await vscode.commands.executeCommand('react-creates-vscode.component');

    const files = await nodeFs.promises.readdir(join(fixturePath, componentName));

    expect(files).toEqual(['index.js', 'index.test.js']);
  });
});
