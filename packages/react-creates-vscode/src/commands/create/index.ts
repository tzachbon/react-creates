import * as vscode from 'vscode';
import { tryRun } from '../../utils/try-run';
import type { CommandWithContext } from '../../main';
import { component } from './component';

const CREATE_OPTIONS = {
  COMPONENT: 'component',
};

export const create: CommandWithContext = (context) => ({
  name: 'react-creates-vscode.create',
  command: (contextUri) =>
    tryRun(async () => {
      const readableOptions = Object.values(CREATE_OPTIONS);
      const selectedOption = await vscode.window.showQuickPick(readableOptions);

      switch (selectedOption) {
        case CREATE_OPTIONS.COMPONENT:
          await component(context).command(contextUri);
          break;

        default:
          await vscode.window.showErrorMessage(
            'Please select one of those options: ' + Object.values(CREATE_OPTIONS).join(', ')
          );
          break;
      }
    }),
});
