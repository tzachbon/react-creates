import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';

export default {
  name: 'react-creates-vsc.component',
  command: async ({ path = '' } = {}) => {
    if (!path) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    const reactCreates = new ReactCreates(path);
    try {
      const { stderr } = await reactCreates.createComponent();

      if (stderr && !stderr.startsWith('npx: installed')) {
        throw new Error(stderr);
      }

      vscode.window.showInformationMessage('Done, your component is ready for work! ⚛️');
      
    } catch (error) {
      vscode.window.showErrorMessage(error?.message || 'Something went wrong with the extension :( Please try again');
    }
  }
};