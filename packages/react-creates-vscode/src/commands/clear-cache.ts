import { FileSystemCache } from 'react-creates';
import * as vscode from 'vscode';
import type { CommandWithContext } from '../main';
import { tryRun } from '../utils/try-run';

export const clearCache: CommandWithContext = ({ fileSystem, rootDir }) => ({
  name: 'react-creates-vscode.clear-cache',
  command: () =>
    tryRun(() => {
      FileSystemCache.delete({ fileSystem, rootDir });

      return vscode.window.showInformationMessage('React Creates cache deleted');
    }),
});
