import * as vscode from 'vscode';

export default {
  name: 'react-creates-vsc.component',
  command: async () => {
    vscode.window.showErrorMessage('Works');
  }
};