import * as vscode from 'vscode';

interface Command {
  name: string;
  command: (...args: any[]) => any;
}

export const registerCommand = (
  {
    name,
    command
  }: Command
) => vscode.commands.registerCommand(name, command);
