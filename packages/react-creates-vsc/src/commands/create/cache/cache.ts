import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';
import { Command } from '../../../utils/register-command';

const command: Command = {
  name: 'react-creates-vsc.clean-cache',
  command: async (contextUri) => {
    if (!contextUri) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    const reactCreates = await ReactCreates.start(contextUri);

    try {
      await reactCreates.cleanCache();

      vscode.window.showInformationMessage('Done, cache cleaned successfully! ⚛️');
      
    } catch (error) {
      vscode.window.showErrorMessage(error?.message || 'Something went wrong with the extension :( Please try again');
    }
  }
};

export default command;