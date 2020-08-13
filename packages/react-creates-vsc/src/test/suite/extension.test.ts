import { expect } from 'chai';
import { beforeEach } from 'mocha';
import * as vscode from 'vscode';
import { activate } from '../../extension';

suite.skip('Extension Entry', () => {

	let fakeContext = {
		subscriptions: []
	};

	beforeEach(() => {
		fakeContext = {
			subscriptions: []
		};

		activate(fakeContext as any);
	});

	test('All registered commands are subscribed', async () => {
		expect(await vscode.commands.getCommands()).to.deep.include.members(fakeContext.subscriptions);
	});
});
