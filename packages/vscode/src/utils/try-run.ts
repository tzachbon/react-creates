import * as vscode from 'vscode';

export function tryRun<T>(callback: () => T): T | Thenable<string | undefined> {
  try {
    return callback();
  } catch (error) {
    return vscode.window.showErrorMessage((error as any)?.message ?? error);
  }
}
