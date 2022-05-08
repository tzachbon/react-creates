import * as vscode from 'vscode';
import { Terminals } from './terminals';

interface RunAutoUpdateOptions {
  rootDir: string;
  runner?: string;
}

export function runAutoGlobalUpdate({ runner, rootDir }: RunAutoUpdateOptions) {
  return Terminals.send(
    vscode.Uri.parse(rootDir),
    runner === 'yarn' ? buildYarnAutoUpdateCommand() : buildNpmAutoUpdateCommand(),
    false
  );
}

function buildNpmAutoUpdateCommand() {
  return `npm i -g react-creates@latest`;
}

function buildYarnAutoUpdateCommand() {
  return `yarn global add react-creates@latest`;
}
