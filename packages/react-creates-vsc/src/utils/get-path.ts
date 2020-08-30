import * as vscode from 'vscode';

export const getPath = () =>
  vscode.Uri.file(
    vscode.window.activeTextEditor?.document.uri.path || vscode.workspace.rootPath || ''
  );
