import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';

export default {
  name: 'react-creates-vsc.component',
  command: async ({ path = '' } = {}) => {
    if (!path) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    const reactCreates = new ReactCreates(path);
    await reactCreates.createComponent();
  }
};