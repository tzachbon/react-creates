import * as vscode from 'vscode';

export type Command = {
  name: string;
  command: (contextUri?: vscode.Uri) => any;
};
export type RegisterCommand<T> = (context: T) => Command;

export function registerCommand({ name, command }: Command) {
  return vscode.commands.registerCommand(name, command);
}
