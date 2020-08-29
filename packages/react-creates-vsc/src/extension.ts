// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerCommand } from './utils/register-command';
import create from './commands/create';
import component from './commands/create/component';
import { checkForUpdate } from './utils/installer';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const createCommand = registerCommand(create);
  const componentCommand = registerCommand(component);

  [createCommand, componentCommand].forEach((command) => context.subscriptions.push(command));
  
  await checkForUpdate();
}

// this method is called when your extension is deactivated
export function deactivate() {}
