
import * as vscode from 'vscode';
import { Command, CommandDetails } from '../model/command';
import { CONSTANT } from './constant';
import { State, Collection, Api } from '../model/state';
import { MessageReceiver } from '../model/message';
import { WebViewApi, WebViewCollection, WebViewState } from '../model/web-state.model';
import { ExtensionState } from '../model/extension-state.model';
let webviewPanel: vscode.WebviewPanel | undefined;
const toastMessage = (message: string): void => {
    vscode.window.showInformationMessage(`Proxy API Server: ${message}`);
}


const checkIfWebviewIsOpen = (): boolean => {
    return webviewPanel !== undefined;
}

const displayExisitngWebView = (context: vscode.ExtensionContext): void => {
    if (webviewPanel) {
        webviewPanel.reveal(vscode.ViewColumn.One);
        webviewPanel.webview.postMessage({
            command: 'loadWebViewState',
            data: loadWebViewState(context, false)
        });
    }
}

const clearWebView = (): void => {
    if (webviewPanel) {
        webviewPanel = undefined;
    }
}

const registerCommands = (command: Command, context: vscode.ExtensionContext): vscode.Disposable[] => {
    const disposables: vscode.Disposable[] = [];
    Object.keys(command).forEach(key => {
        const com = command[key];
        disposables.push(vscode.commands.registerCommand(com.name, com.callback(context)));
    });
    return disposables;
}
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
        data: loadWebViewState(context)
    });
    panel.onDidDispose(() => {
        // When the panel is closed, cancel any future updates to the webview content
        onDidDispose(context);
        clearWebView();
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
const loadWebViewState = (context: vscode.ExtensionContext, loadingFirstTime: boolean = true): WebViewState | undefined => {
    const state: WebViewState | undefined = context.globalState.get(CONSTANT.IDENTIFIER.WEB_STATE);
    if (state && loadingFirstTime) {
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
                        // Set the response headers
                        api.apiDetails.response.headers.forEach((header) => {
                            if (header.name.trim() && header.value.trim()) {
                                res.setHeader(header.name, header.value);
                            }
                        });
                        // Set the response code
                        const responseBody = api.apiDetails.response.body.content;
                        if (responseBody && responseBody.trim()) {
                            let parsedResponseBody;
                            try {
                                parsedResponseBody = JSON.parse(responseBody.trim());
                            }
                            catch (error) {
                                parsedResponseBody = responseBody.trim();
                            }
                            res.status(api.apiDetails.responseCode).json(parsedResponseBody);
                        } else {
                            // Send a void response if no content exists
                            res.status(api.apiDetails.responseCode).end();
                        }
                    } catch (error) {
                        res.status(500).json(error).end();
                    }
                }, api.apiDetails.latency || 0);
            }
        });
    });
    return state;
}
const deleteState = (context: vscode.ExtensionContext): Thenable<void> => {
    return context.globalState.update(CONSTANT.IDENTIFIER.GLOBAL_STATE, undefined);
}
const saveExtensionState = (context: vscode.ExtensionContext, value: ExtensionState): void => {
    context.globalState.update(CONSTANT.IDENTIFIER.EXTENSION_STATE, value);
}
const getExtensionState = (context: vscode.ExtensionContext): ExtensionState | undefined => {
    return context.globalState.get(CONSTANT.IDENTIFIER.EXTENSION_STATE);
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
    postMessageToWebview,
    saveExtensionState,
    getExtensionState,
    checkIfWebviewIsOpen,
    displayExisitngWebView
}