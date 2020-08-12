
import execa from 'execa';

export default class ReactCreates {
  target: string;
  constructor(private vscode: typeof import('vscode')) {
    this.target = vscode.window.activeTextEditor?.document.fileName ?? vscode.workspace.rootPath!;
  }

  async createComponent() {
    await execa('npx', ['react-creates', 'component']);
  }

}