import * as vscode from 'vscode';
import { CREATE_OPTIONS } from '../../types';
import component from './component';
import cache from './cache';

export default {
  name: 'react-creates-vsc.create',
  command: async () => {
    const readableOptions = Object.values(CREATE_OPTIONS);
    const selectedOption = await vscode.window.showQuickPick(readableOptions);
    const path = vscode.window.activeTextEditor?.document.uri.path || vscode.workspace.rootPath;

    switch (selectedOption) {
      case CREATE_OPTIONS.COMPONENT:
        await component.command({ path });
        break;
      case CREATE_OPTIONS.CLEAN_CACHE:
        await cache.command({ path });
        break;

      default:
        vscode.window.showErrorMessage('Please select an option');
        break;
    }
  },
};
