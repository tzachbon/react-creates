import { FileSystemCache } from 'react-creates';
import * as vscode from 'vscode';
import type { CommandWithContext } from '../main';
import { tryRun } from '../utils/try-run';

export const clearCache: CommandWithContext = ({ fileSystem, rootDir }) => ({
  name: 'react-creates-vscode.clear-cache',
  command: () =>
    tryRun(async () => {
      const response = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder:
          'Clearing React creates cache will result in loss of all the templates old data for this workspace. Are you sure you want to continue?',
      });

      if (response === 'Yes') {
        FileSystemCache.delete({ fileSystem, rootDir });
        return vscode.window.showInformationMessage('React Creates cache deleted');
      } else {
        return vscode.window.showInformationMessage('React Creates cache not deleted');
      }
    }),
});
