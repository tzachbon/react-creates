
import * as vscode from 'vscode';
import { CREATE_OPTIONS } from '../../types';
import component from './component';


export default {
	name: 'react-creates-vsc.create',
	command: async () => {
		const readableOptions = Object.values(CREATE_OPTIONS);
		const selectedOption = await vscode.window.showQuickPick(readableOptions);


		switch (selectedOption) {
			case CREATE_OPTIONS.COMPONENT:
				await component.command();
				break;

			default:
				vscode.window.showErrorMessage('Please select an option');
				break;
		}
	}
};