import * as vscode from 'vscode';
import { getPathUri } from '../../utils/get-path-uri';
import { tryRun } from '../../utils/try-run';
import { buildCreateComponentCommand, FileSystemCache } from 'react-creates';
import { ComponentOption, createComponentProperties } from '@react-creates/core';
import type { CommandWithContext } from '../../main';
import { Terminals } from '../../terminals';

const propertyDescriptions = {
  style: 'The style language to use for the component.',
  type: 'The type of component to create.',
  language: 'The language to use for the component.',
  propTypes: 'Whether to include prop-types.',
  skipTest: 'Whether to skip the test file.',
  cssModules: 'Whether to use CSS Modules.',
};

export const component: CommandWithContext = ({ fileSystem, config }) => ({
  name: 'react-creates-vscode.component',
  command: (contextUri) =>
    tryRun(async () => {
      if (!contextUri?.fsPath) {
        contextUri = getPathUri();
      }

      const cache = FileSystemCache.create({ fileSystem, rootDir: contextUri.fsPath });
      const name = await vscode.window.showInputBox({ prompt: 'Name of the component' });

      if (!name) {
        throw new Error('Hey, component must have a name');
      }

      const probablyDirectory = fileSystem.statSync(contextUri.fsPath).isDirectory()
        ? contextUri.fsPath
        : fileSystem.dirname(contextUri.fsPath);

      const directory =
        (await vscode.window.showInputBox({ prompt: 'Directory of the component', value: probablyDirectory })) ??
        probablyDirectory;

      const terminalCommand = await buildCreateComponentCommand(
        {
          name,
          directory,
        },
        async (key) => {
          type Keys = keyof Pick<typeof createComponentProperties, 'style' | 'language' | 'type'>;

          if (cache.has(key)) {
            return cache.get(key);
          }

          let value: ComponentOption[typeof key] | undefined;

          if (key === 'style' || key === 'language' || key === 'type') {
            const values = [...createComponentProperties[key as unknown as Keys]];
            const response = await vscode.window.showQuickPick(values, {
              matchOnDescription: true,
              placeHolder: propertyDescriptions[key as unknown as Keys],
            });

            value = response as unknown as ComponentOption[typeof key] | undefined;
          } else if (key === 'skipTest' || key === 'propTypes' || key === 'cssModules') {
            const values = ['false', 'true'];
            const response = await vscode.window.showQuickPick(values, {
              matchOnDescription: true,
              placeHolder: propertyDescriptions[key as unknown as 'skipTest' | 'propTypes'],
            });

            value = (response === 'true') as ComponentOption[typeof key];
          }

          if (value) {
            cache.set(key, value);
          }

          return value;
        }
      );

      Terminals.send(
        vscode.Uri.parse(directory),
        [
          config.get('package-manager-runner') === 'npm' ? 'npm_config_yes=true npx' : 'yarn',
          'react-creates',
          ...terminalCommand,
        ].join(' ')
      );
    }),
});
