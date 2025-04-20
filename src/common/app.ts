import * as fs from 'fs';
import { ExtensionContext, StatusBarAlignment, Uri } from 'vscode';
import { registerCommands, addNewWebViewTab, addStatusBarItem, saveState, saveWebViewState, getExtensionState, saveExtensionState, checkIfWebviewIsOpen, displayExisitngWebView } from './vscode-apis';
import { COMMAND, CONSTANT } from './constant';
import path from 'path';
import { MessageReceiver } from '../model/message';
import { State } from '../model/state';
import { restartServer, startServer, stopServer } from './server';
import { WebViewState } from '../model/web-state.model';

const saveStateAndStartServer = (state: State, context: ExtensionContext) => {
    saveState(context, state);
    restartServer(context);
}

const loadLandingTab = (context: ExtensionContext) => {
    if (checkIfWebviewIsOpen()) {
        displayExisitngWebView(context);
        restartServer(context);
    } else {
        const htmlPath = path.join(context.extensionPath, 'web-view', 'dist', 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        const scriptPathOnDisk = Uri.file(path.join(context.extensionPath, 'web-view', 'dist', 'index.js'));
        const stylePathOnDisk = Uri.file(path.join(context.extensionPath, 'web-view', 'dist', 'index.css'));
        const logoPathOnDisk = Uri.file(path.join(context.extensionPath, 'web-view', 'dist', 'logo.webp'));
        const uris: { [identifire: string]: Uri } = {};
        uris[CONSTANT.IDENTIFIER.SCRIPT_URI] = scriptPathOnDisk;
        uris[CONSTANT.IDENTIFIER.STYLE_URI] = stylePathOnDisk;
        uris[CONSTANT.IDENTIFIER.LOGO_URI] = logoPathOnDisk;
        const messageReceiver = (message: MessageReceiver<State, WebViewState>) => {
            switch (message.command) {
                case 'saveStateAndStartServer':
                    saveStateAndStartServer(message.data, context);
                    return;
                case 'saveWebViewState':
                    saveWebViewState(context, message.webViewState);
                    return;
            }
        }
        const onDisponse = (context: ExtensionContext) => {
            stopServer(context);
        }
        addNewWebViewTab(CONSTANT.EXTENSION.STATUSBAR_BUTTON, CONSTANT.EXTENSION.TITLE, htmlContent, context, uris, messageReceiver, onDisponse);

        startServer(context);
    }

}

const initializeApp = (context: ExtensionContext) => {
    const extensionState = getExtensionState(context);
    if (!extensionState || (extensionState && extensionState.isFirstTimeInstalled)) {
        saveExtensionState(context, { isFirstTimeInstalled: false });
        loadLandingTab(context);
    }
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

