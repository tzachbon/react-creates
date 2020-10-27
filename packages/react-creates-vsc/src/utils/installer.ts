import axios from 'axios';
import execa from 'execa';
import * as vscode from 'vscode';

export class Installer {
  private _latestVersion: string | undefined;

  static async getCurrentVersion() {
    const execaValue = await execa(
      'npm',
      ['list', '--depth', '1', '--global', 'react-creates'],
      { reject: false }
    ) as execa.ExecaReturnValue<string> | Error;

    let splitValue = '';

    if ('message' in execaValue) {
      splitValue = execaValue.message;
    } else {
      splitValue = execaValue.stdout;
    }

    const version = splitValue?.split('@')?.[1]

    return version?.trim();
  }

  static async create() {
    const currentVersion = await Installer.getCurrentVersion();

    return new Installer(currentVersion);
  }

  private constructor(public currentVersion: string | undefined) { }

  hasLatestVersion() {
    return !!this.currentVersion && this.currentVersion === this.latestVersion;
  }

  async fetchLatestVersion() {
    const {
      data: { version: latestVersion },
    } = await axios('http://registry.npmjs.com/react-creates/latest');

    this._latestVersion = latestVersion?.trim();

    return this._latestVersion;
  }

  get latestVersion() {
    return this._latestVersion;
  }

  async update() {
    const { stderr } = await execa('npm', ['i', '-g', 'react-creates@latest']);

    if (stderr) {
      throw new Error(stderr);
    }

    this.currentVersion = await Installer.getCurrentVersion();
  }
}

export const checkForUpdate = async () => {
  const installer = await Installer.create();

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: `React Creates`,
    },
    async (progress) => {
      try {
        await installer.fetchLatestVersion();

        progress.report({
          increment: 33,
          message: `Checking for updates... (current version: ${installer.currentVersion})`,
        });

        if (installer.hasLatestVersion()) {
          return progress.report({
            increment: 100,
            message: `Latest version is installed (${installer.latestVersion})`,
          });
        }

        progress.report({
          increment: 66,
          message: `Updating to latest version (${installer.latestVersion})`,
        });

        await installer.update();

        progress.report({
          increment: 100,
          message: `React Creates: Update completed (${installer.currentVersion})`,
        });
      } catch (e) {
        vscode.window.showErrorMessage('Failed to update - for better experience run `npm i -g react-creates`')
      }

    }
  );
};
