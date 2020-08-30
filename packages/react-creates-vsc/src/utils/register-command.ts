import * as vscode from 'vscode';

export interface Command {
  name: string;
  command: (contextUri?: vscode.Uri) => any;
}

export const registerCommand = (
  {
    name,
    command
  }: Command
) => vscode.commands.registerCommand(name, command);
