import * as vscode from 'vscode';
import sinon from 'sinon';
import { expect } from 'chai';
import { before, after } from 'mocha';
import { activate } from '../../extension';
import { activationEvents, contributes } from '../assets/package.json';


const { commands, menus } = contributes;

suite('Package JSON', () => {
  let fakeContext = {
    subscriptions: []
  };

  before(async () => {
    fakeContext = {
      subscriptions: []
    };

    const fake = (name: string) => name;

    sinon.replace(vscode.commands, 'registerCommand', fake as any);

    activate(fakeContext as any);
  });

  after(() => {
    sinon.reset();
  });

  test('Command activated', () => {

    const activatedEvent: string[] = activationEvents.map(command => command.slice('onCommand:'.length)).sort();

    expect(
      activatedEvent
    ).to.deep.includes.members(fakeContext.subscriptions.sort());
  });

  test('Command add contributes', () => {
    expect(
      commands.map(({ command }) => command).sort()
    ).to.deep.include.members(fakeContext.subscriptions.sort());
  });

  test('Menus commands are registered', () => {
    const menuCommands = menus['explorer/context'].map(({ command }) => command).sort();

    expect(fakeContext.subscriptions.sort()).to.deep.include.members(menuCommands);
  });
});