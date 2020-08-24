import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';

export default {
  name: 'react-creates-vsc.clean-cache',
  command: async ({ path = '' } = {}) => {
    if (!path) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    const reactCreates = await ReactCreates.start(path);

    try {
      await reactCreates.cleanCache();

      vscode.window.showInformationMessage('Done, cache cleaned successfully! ⚛️');
      
    } catch (error) {
      vscode.window.showErrorMessage(error?.message || 'Something went wrong with the extension :( Please try again');
    }
  }
};