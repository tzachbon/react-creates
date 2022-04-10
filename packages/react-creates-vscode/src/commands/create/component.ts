import * as vscode from 'vscode';
import { getPathUri } from '../../utils/get-path-uri';
import { tryRun } from '../../utils/try-run';
import { ComponentOption, createComponent, propertiesOptions } from 'react-creates';
import type { CommandWithContext } from '../../extension';

export const component: CommandWithContext = ({ fileSystem }) => ({
  name: 'react-creates-vscode.component',
  command: (contextUri) =>
    tryRun(async () => {
      if (!contextUri?.fsPath) {
        contextUri = getPathUri();
      }

      const name = await vscode.window.showInputBox({ prompt: 'Name of the component' });

      if (!name) {
        throw new Error('Hey, component must have a name');
      }

      const componentType = (await vscode.window.showQuickPick(Object.values(propertiesOptions.type), {
        placeHolder: propertiesOptions.type[0],
      })) as ComponentOption['type'];

      await createComponent(
        {
          name,
          directory: contextUri.fsPath,
          type: componentType,
        },
        {
          fileSystem,
        }
      );
    }),
});
