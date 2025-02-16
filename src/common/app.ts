import * as fs from 'fs';
import { ExtensionContext, StatusBarAlignment } from 'vscode';
import { registerCommands, addNewWebViewTab, addStatusBarItem } from './vscode-apis';
import { COMMAND } from './constant';
import path from 'path';

const loadLandingTab = (context: ExtensionContext) => {
    const htmlPath = path.join(context.extensionPath, 'src', 'web', 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    addNewWebViewTab('landingTab', 'Landing Tab', htmlContent);
}

const initializeApp = (context: ExtensionContext) => {
    console.log('App initialized');

    addStatusBarItem(StatusBarAlignment.Right, 100, COMMAND.LANDING_TAB);
    context.subscriptions.push(...registerCommands(COMMAND, context));
}
const deactivateApp = () => { }

export {
    initializeApp,
    deactivateApp,
    loadLandingTab
}