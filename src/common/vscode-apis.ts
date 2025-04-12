
import * as vscode from 'vscode';
import { Command, CommandDetails } from '../model/command';
import { CONSTANT } from './constant';
import { State, Collection, Api } from '../model/state';
import { MessageReceiver } from '../model/message';
import { WebViewApi, WebViewCollection, WebViewState } from '../model/web-state.model';
const toastMessage = (message: string): void => {
    vscode.window.showInformationMessage(`Proxy API Server: ${message}`);
}

const registerCommands = (command: Command, context: vscode.ExtensionContext): vscode.Disposable[] => {
    const disposables: vscode.Disposable[] = [];
    Object.keys(command).forEach(key => {
        const com = command[key];
        disposables.push(vscode.commands.registerCommand(com.name, com.callback(context)));
    });
    return disposables;
}
let webviewPanel: vscode.WebviewPanel | undefined;
const addNewWebViewTab = <T, R>(id: string, title: string, content: string, context: vscode.ExtensionContext, uris: { [identifier: string]: vscode.Uri },
    messageReceiver: (message: MessageReceiver<T, R>) => void, onDidDispose: (context: vscode.ExtensionContext) => void
): void => {
    const panel = vscode.window.createWebviewPanel(
        id,
        title,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)]
        }
    );

    if (uris && Object.keys(uris).length > 0) {
        Object.keys(uris).forEach(key => {
            const uri = uris[key];
            const scriptUri = panel.webview.asWebviewUri(uri);
            content = content.replaceAll(key, scriptUri.toString());
        });
    }
    panel.webview.html = content;
    panel.webview.onDidReceiveMessage(
        (message: MessageReceiver<T, R>) => {
            messageReceiver(message);
        },
        undefined,
        context.subscriptions
    );
    panel.webview.postMessage({
        command: 'loadWebViewState',
        data: loadWebViewState(context) // Replace with your actual collections data
    });
    panel.onDidDispose(() => {
        // When the panel is closed, cancel any future updates to the webview content
        onDidDispose(context);
    }
    );
    webviewPanel = panel;
}

const addStatusBarItem = (alignment: vscode.StatusBarAlignment, priority: number, command: CommandDetails): vscode.StatusBarItem => {
    const statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    statusBarItem.text = command.title;
    statusBarItem.command = command.name;
    statusBarItem.tooltip = command.tooltip;
    statusBarItem.show();
    return statusBarItem;
}

const saveState = (context: vscode.ExtensionContext, value: State): void => {
    context.globalState.update(CONSTANT.IDENTIFIER.GLOBAL_STATE, value);
}
const saveWebViewState = (context: vscode.ExtensionContext, value: WebViewState | undefined): void => {
    if (value) {
        context.globalState.update(CONSTANT.IDENTIFIER.WEB_STATE, value);
    }
}
const loadWebViewState = (context: vscode.ExtensionContext): WebViewState | undefined => {
    const state: WebViewState | undefined = context.globalState.get(CONSTANT.IDENTIFIER.WEB_STATE);
    if (state) {
        state.collections.forEach((collection: WebViewCollection) => {
            collection.api.forEach((api: WebViewApi) => {
                api.islive = false;
            })
        })
    }
    return state;
}
const loadState = (context: vscode.ExtensionContext): State | undefined => {
    const state: State | undefined = context.globalState.get(CONSTANT.IDENTIFIER.GLOBAL_STATE);
    state && state.collections.forEach((collection: Collection) => {
        collection.apis.forEach((api: Api) => {
            api.apiDetails.handler = (req: any, res: any) => {
                setTimeout(() => {
                    try {
                        api.apiDetails.response.body.content = JSON.parse(api.apiDetails.response.body.content);
                    } catch (error) {

                    }
                    api.apiDetails.response.headers.forEach((header) => {
                        if (header.name.trim() && header.value.trim()) {
                            res.setHeader(header.name, header.value);
                        }
                    });

                    res.status(api.apiDetails.responseCode).json(api.apiDetails.response.body.content);
                }, api.apiDetails.latency || 0);
            }
        });
    });
    return state;
}
const deleteState = (context: vscode.ExtensionContext): Thenable<void> => {
    return context.globalState.update(CONSTANT.IDENTIFIER.GLOBAL_STATE, undefined);
}

const postMessageToWebview = (command: string, data?: any) => {
    if (webviewPanel) {
        webviewPanel.webview.postMessage({
            command: command,
            data: data
        });
    }
}
export {
    toastMessage,
    registerCommands,
    addNewWebViewTab,
    addStatusBarItem,
    loadState,
    saveState,
    deleteState,
    saveWebViewState,
    postMessageToWebview
}