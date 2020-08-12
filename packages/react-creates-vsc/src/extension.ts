// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import execa from 'execa';
import { startCase } from 'lodash';
import { CREATE_OPTIONS } from './types';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "react-creates-vsc" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('react-creates-vsc.create', async () => {

		const readableOptions = Object.values(CREATE_OPTIONS).map(str => startCase(str));
		const selectedOption = await vscode.window.showQuickPick(readableOptions);


		if (!selectedOption) {
			vscode.window.showErrorMessage('Please select an option');
			return;
		}

		// execa();
		
		vscode.window.showInformationMessage(selectedOption);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
