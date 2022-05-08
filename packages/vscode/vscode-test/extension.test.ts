import { describe, it } from 'mocha';
import expect from 'expect';
import * as vscode from 'vscode';

describe('Extension', () => {
  it('Command registered', async () => {
    expect(await vscode.commands.getCommands()).toEqual(
      expect.arrayContaining(['react-creates-vscode.component', 'react-creates-vscode.create'])
    );
  });
});
