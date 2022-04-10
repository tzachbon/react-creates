// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import type * as vscode from 'vscode';
import { RegisterCommand, registerCommand } from './register-command';
import type { IFileSystem } from '@file-services/types';
import { nodeFs } from '@file-services/node';
import { component } from './commands/create/component';
import { create } from './commands/create';
import { Terminals } from './terminals';

export type Context = { fileSystem: IFileSystem };
export type CommandWithContext = RegisterCommand<Context>;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const commandContext: Context = {
    fileSystem: nodeFs,
  };

  const createCommand = registerCommand(create(commandContext));
  const componentCommand = registerCommand(component(commandContext));

  [createCommand, componentCommand].forEach((command) => context.subscriptions.push(command));
}

// this method is called when your extension is deactivated
export function deactivate() {
  Terminals.disposeAll();
}
