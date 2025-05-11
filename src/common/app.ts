import { ExtensionContext, StatusBarAlignment, Disposable } from 'vscode';
import { registerCommands, addStatusBarItem, saveState, saveWebViewState, getExtensionState, saveExtensionState, deleteStates } from './vscode-apis';
import { COMMAND } from './constant';
import { MessageReceiver } from '../model/message';
import { State } from '../model/state';
import { restartServer, startServer, stopServer } from './server';
import { WebViewState } from '../model/web-state.model';
import { WebViewManager } from '../web/web-view-manager';

const saveStateAndStartServer = (state: State, context: ExtensionContext) => {
    saveState(context, state);
    restartServer(context);
}
const messageReceiver = (message: MessageReceiver<State, WebViewState>, context: ExtensionContext) => {
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
    WebViewManager.disposeAndClearWebView();
    stopServer(context);
}
const loadLandingTab = (context: ExtensionContext) => {
    const webViewManager: WebViewManager = WebViewManager.initializeWebViewPanel(context);
    webViewManager.displayWebViewPanel(messageReceiver, onDisponse, (context: ExtensionContext) => {
        startServer(context);
    });
}

const initializeApp = (context: ExtensionContext) => {
    const extensionState = getExtensionState(context);
    if (!extensionState || (extensionState && extensionState.isFirstTimeInstalled)) {
        saveExtensionState(context, { isFirstTimeInstalled: false });
        loadLandingTab(context);
    }
    const disposables: Disposable[] = registerCommands(COMMAND, context);
    context.subscriptions.push(...disposables);
    addStatusBarItem(StatusBarAlignment.Right, 100, COMMAND.LANDING_TAB);
}
const deactivateApp = () => {
    // disposeAndClearWebView();
    deleteStates();
}

export {
    initializeApp,
    deactivateApp,
    loadLandingTab
}

