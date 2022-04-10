import * as vscode from 'vscode';

export class Terminals {
  private static terminals = new Map<string, vscode.Terminal>();

  static getTerminalName(name: string) {
    return `React Creates: ${name}`;
  }

  static getWorkspaceFolderFromUri(uri: vscode.Uri) {
    return vscode.workspace.getWorkspaceFolder(uri);
  }

  static send(workspaceFolder: vscode.WorkspaceFolder | vscode.Uri, command: string): vscode.Terminal {
    if (workspaceFolder instanceof vscode.Uri) {
      workspaceFolder = this.getWorkspaceFolderFromUri(workspaceFolder)!;
    }

    const terminal = this.getTerminal(workspaceFolder);

    terminal.show();

    terminal.sendText(command);

    return terminal;
  }

  static disposeAll(): void {
    for (const terminal of this.terminals.values()) {
      terminal.dispose();
    }
  }

  private static getTerminal(workspaceFolder: vscode.WorkspaceFolder): vscode.Terminal {
    const name = this.getTerminalName(workspaceFolder.name);

    if (!this.terminals.has(workspaceFolder.name) || !this.isTerminalExisting(name)) {
      this.terminals.set(
        workspaceFolder.name,
        vscode.window.createTerminal({
          name,
          cwd: workspaceFolder.uri.fsPath,
        })
      );
    }

    return this.terminals.get(workspaceFolder.name)!;
  }

  private static isTerminalExisting(name: string): boolean {
    return vscode.window.terminals.map((terminal) => terminal.name).includes(name);
  }
}
