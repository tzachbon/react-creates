import * as vscode from 'vscode';

export function tryRun<T>(callback: () => T): T {
  try {
    return callback();
  } catch (error) {
    void vscode.window.showErrorMessage((error as any)?.message ?? error);

    throw error;
  }
}
