import * as fs from 'fs';
import { ExtensionContext, StatusBarAlignment, Uri } from 'vscode';
import { registerCommands, addNewWebViewTab, addStatusBarItem } from './vscode-apis';
import { COMMAND, CONSTANT } from './constant';
import path from 'path';

const loadLandingTab = (context: ExtensionContext) => {
    const htmlPath = path.join(context.extensionPath, 'src', 'web', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const scriptPathOnDisk = Uri.file(path.join(context.extensionPath, 'src', 'web', 'script.js'));
    const stylePathOnDisk = Uri.file(path.join(context.extensionPath, 'src', 'web', 'style.css'));
    const logoPathOnDisk = Uri.file(path.join(context.extensionPath, 'src', 'assets', 'logo.webp'));
    const uris: { [identifire: string]: Uri } = {};
    uris[CONSTANT.IDENTIFIER.SCRIPT_URI] = scriptPathOnDisk;
    uris[CONSTANT.IDENTIFIER.STYLE_URI] = stylePathOnDisk;
    uris[CONSTANT.IDENTIFIER.LOGO_URI] = logoPathOnDisk;
    addNewWebViewTab(CONSTANT.EXTENSION.STATUSBAR_BUTTON, CONSTANT.EXTENSION.TITLE, htmlContent, context, uris);
}

const initializeApp = (context: ExtensionContext) => {
    // for development purpose only
    loadLandingTab(context);
    const disposables = registerCommands(COMMAND, context);
    context.subscriptions.push(...disposables);
    addStatusBarItem(StatusBarAlignment.Right, 100, COMMAND.LANDING_TAB);
}
const deactivateApp = () => { }

export {
    initializeApp,
    deactivateApp,
    loadLandingTab
}