// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RegisterCommand, registerCommand } from './register-command';
import type { IFileSystem } from '@file-services/types';
import { nodeFs } from '@file-services/node';
import { component } from './commands/create/component';
import { create } from './commands/create';
import { Terminals } from './terminals';
import { runAutoGlobalUpdate } from './auto-global-update';
import { clearCache } from './commands/clear-cache';

export type CommandWithContext = RegisterCommand<Context>;
export type Context = { rootDir: string; fileSystem: IFileSystem; config: vscode.WorkspaceConfiguration };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootDir = getRootDir();

  console.log(`React Creates activated - "${context.extensionPath}" `);

  if (!rootDir) {
    vscode.window.showErrorMessage('No workspace folder found.');
    return;
  }

  const commandContext: Context = {
    rootDir,
    fileSystem: nodeFs,
    config: vscode.workspace.getConfiguration('react-creates'),
  };

  const autoUpdate = Boolean(commandContext.config.get<boolean>('auto-global-update'));

  if (autoUpdate) {
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
    item.text = '$(sync~spin) Updating global React creates in the background...';
    item.show();

    runAutoGlobalUpdate({
      rootDir,
      runner: commandContext.config.get<string>('package-manager-runner'),
    });

    setTimeout(() => {
      item.dispose();
    }, 5000);
  }

  [create, component, clearCache].forEach((command) =>
    context.subscriptions.push(registerCommand(command(commandContext)))
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  Terminals.disposeAll();
}

function getRootDir() {
  return (
    vscode.workspace.workspaceFolders?.[0]?.uri.path ||
    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ||
    vscode.workspace.rootPath ||
    vscode.window.activeTextEditor?.document.uri.fsPath
  );
}
