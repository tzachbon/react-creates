import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';
import { getPath } from '../../../utils/get-path';

export default {
  name: 'react-creates-vsc.component',
  command: async ({ path = getPath() } = {}) => {
    if (!path) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    const reactCreates = await ReactCreates.start(path);

    try {
      await reactCreates.createComponent();
    } catch (error) {
      vscode.window.showErrorMessage(
        error?.message || 'Something went wrong with the extension :( Please try again'
      );
    }
  },
};
