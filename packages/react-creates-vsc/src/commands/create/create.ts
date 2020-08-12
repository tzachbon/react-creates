
import * as vscode from 'vscode';
import execa from 'execa';
import { startCase } from 'lodash';
import { CREATE_OPTIONS } from '../../types';


export default {
  name: 'react-creates-vsc.create',
  command: async () => {
		const readableOptions = Object.values(CREATE_OPTIONS).map(str => startCase(str));
		const selectedOption = await vscode.window.showQuickPick(readableOptions);


		if (!selectedOption) {
			vscode.window.showErrorMessage('Please select an option');
			return;
		}

		// execa();
		
		vscode.window.showInformationMessage(selectedOption);
  }
};