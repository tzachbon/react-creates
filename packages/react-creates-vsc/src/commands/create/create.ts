import * as vscode from 'vscode';
import { CREATE_OPTIONS } from '../../types';
import { getPath } from '../../utils/get-path';
import { Command } from './../../utils/register-command';
import component from './component';
import cache from './cache';

const command: Command = {
  name: 'react-creates-vsc.create',
  command: async (contextUri = getPath()) => {
    const readableOptions = Object.values(CREATE_OPTIONS);
    const selectedOption = await vscode.window.showQuickPick(readableOptions);

    switch (selectedOption) {
      case CREATE_OPTIONS.COMPONENT:
        await component.command(contextUri);
        break;
      case CREATE_OPTIONS.CLEAN_CACHE:
        await cache.command(contextUri);
        break;

      default:
        vscode.window.showErrorMessage('Please select an option');
        break;
    }
  },
};

export default command;
