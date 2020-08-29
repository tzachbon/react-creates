import axios from 'axios';
import execa from 'execa';
import * as vscode from 'vscode';

const VALID_VERSION_PATTERN = /^[1-9]\d*(\.[1-9]\d*)*$/;

export class Installer {
  private _latestVersion: string | undefined;

  static async getCurrentVersion() {
    const { stdout } = await execa('npm', ['view', 'react-creates', 'version']);

    return VALID_VERSION_PATTERN.test(stdout) ? stdout : undefined;
  }

  static async create() {
    const currentVersion = await Installer.getCurrentVersion();

    return new Installer(currentVersion);
  }

  private constructor(public currentVersion: string | undefined) {}

  get hasLatestVersion() {
    return !!this.currentVersion && this.currentVersion === this.latestVersion;
  }

  async fetchLatestVersion() {
    const {
      data: { version: latestVersion },
    } = await axios('http://registry.npmjs.com/react-creates/latest');

    this._latestVersion = latestVersion;

    return this._latestVersion;
  }

  get latestVersion() {
    return this._latestVersion;
  }

  async update() {
    const { stderr } = await execa('npm', ['i', '-g', 'react-creates']);

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
      title: `React Creates: Checking for updates... (current version: ${installer.currentVersion})`,
    },
    async (progress) => {

      await installer.fetchLatestVersion();

      progress.report({ increment: 33 });

      if (installer.hasLatestVersion) {
        progress.report({
          increment: 100,
          message: `React Creates: Latest version is installed (${installer.latestVersion})`,
        });
      }

      progress.report({
        increment: 66,
        message: `React Creates: Updating to latest version (${installer.latestVersion})`,
      });

      await installer.update();

      progress.report({
        increment: 100,
        message: `React Creates: Update completed (${installer.currentVersion})`,
      });
    }
  );
};
