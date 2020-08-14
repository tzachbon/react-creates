import { expect } from 'chai';
import { beforeEach } from 'mocha';
import * as vscode from 'vscode';
import { activate } from '../../extension';
import { contributes } from '../assets/package.json';

const extensionCommands = contributes.commands.map(({ command }) => command);

suite('Extension Entry', () => {

	let fakeContext = {
		subscriptions: []
	};

	beforeEach(() => {
		fakeContext = {
			subscriptions: []
		};

		activate(fakeContext as any);
	});

	test('All registered commands are subscribed', (done) => {
		vscode.commands.getCommands().then(commands => {
			expect(commands).to.deep.include.members(extensionCommands);
			done();
		});
	});
});
