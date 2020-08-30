import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';
import { Command } from '../../../utils/register-command';

const command: Command = {
  name: 'react-creates-vsc.component',
  command: async (contextUri) => {
    if (!contextUri?.fsPath) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    try {
      const reactCreates = await ReactCreates.start(contextUri.fsPath);
      await reactCreates.createComponent();
    } catch (error) {
      vscode.window.showErrorMessage(
        error?.message || 'Something went wrong with the extension :( Please try again'
      );
    }
  },
};

export default command;
