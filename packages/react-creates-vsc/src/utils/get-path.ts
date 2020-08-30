import * as vscode from 'vscode';

export const getPath = () =>
  vscode.window.activeTextEditor?.document.uri.path || vscode.workspace.rootPath;
