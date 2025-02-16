import { ExtensionContext } from 'vscode';
import { initializeApp, deactivateApp } from './common/app';

export function activate(context: ExtensionContext) {
	initializeApp(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
	deactivateApp();
}

