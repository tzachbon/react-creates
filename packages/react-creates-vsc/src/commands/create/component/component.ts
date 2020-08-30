import * as vscode from 'vscode';
import ReactCreates from '../../../utils/react-creates';
import { getPath } from '../../../utils/get-path';
import { Optional } from 'utility-types';

export default {
  name: 'react-creates-vsc.component',
  command: async ({
    path,
    ...rest
  }: { path?: string | undefined; _fsPath?: string | undefined } = {}) => {
    
    path ||= rest._fsPath;

    if (!path) {
      return vscode.window.showErrorMessage('Path is not found');
    }

    try {
      const reactCreates = await ReactCreates.start(path);
      await reactCreates.createComponent();
    } catch (error) {
      vscode.window.showErrorMessage(
        error?.message || 'Something went wrong with the extension :( Please try again'
      );
    }
  },
};
