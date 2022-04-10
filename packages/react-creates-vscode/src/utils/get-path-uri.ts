import * as vscode from 'vscode';

export const getPathUri = () =>
  vscode.Uri.file(vscode.window.activeTextEditor?.document.uri.path || vscode.workspace.rootPath || '');
