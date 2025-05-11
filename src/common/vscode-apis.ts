
import { commands, ExtensionContext, StatusBarAlignment, StatusBarItem, Uri, ViewColumn, WebviewPanel, window, Disposable } from 'vscode';
import { Command, CommandDetails } from '../model/command';
import { State, Collection, Api } from '../model/state';
import { MessageReceiver } from '../model/message';
import { WebViewState } from '../model/web-state.model';
import { ExtensionState } from '../model/extension-state.model';
import { PASStorageService } from './vscode-storage.service';
let webviewPanel: WebviewPanel | undefined;
let persistContext: ExtensionContext | undefined;

const toastMessage = (message: string): void => {
    window.showInformationMessage(`Proxy API Server: ${message}`);
}

const registerCommands = (command: Command, context: ExtensionContext): Disposable[] => {
    const disposables: Disposable[] = [];
    Object.keys(command).forEach(key => {
        const com = command[key];
        disposables.push(commands.registerCommand(com.name, com.callback(context)));
    });
    return disposables;
};
const addNewWebViewTab = <T, R>(id: string, title: string, content: string, context: ExtensionContext, uris: { [identifier: string]: Uri },
    messageReceiver: (message: MessageReceiver<T, R>, context: ExtensionContext) => void,
    postMessage: { command: string, data: (context: ExtensionContext) => WebViewState | undefined }, onDidDispose: (context: ExtensionContext) => void
): WebviewPanel => {
    persistContext = context;
    const panel = window.createWebviewPanel(
        id,
        title,
        ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [Uri.file(context.extensionPath)]
        }
    );

    if (uris && Object.keys(uris).length > 0) {
        Object.keys(uris).forEach(key => {
            const uri = uris[key];
            const scriptUri = panel.webview.asWebviewUri(uri);
            content = content.replaceAll(key, scriptUri.toString());
        });
    }
    panel.webview.onDidReceiveMessage(
        (message: MessageReceiver<T, R>) => {
            messageReceiver(message, context);
        },
        undefined,
        context.subscriptions
    );
    panel.webview.postMessage({
        command: postMessage.command,
        data: postMessage.data(context)
    });
    panel.onDidDispose(() => {
        // When the panel is closed, cancel any future updates to the webview content
        onDidDispose(context);
    }
    );

    panel.webview.html = content;
    webviewPanel = panel;
    return panel;
}

const addStatusBarItem = (alignment: StatusBarAlignment, priority: number, command: CommandDetails): StatusBarItem => {
    const statusBarItem = window.createStatusBarItem(alignment, priority);
    statusBarItem.text = command.title;
    statusBarItem.command = command.name;
    statusBarItem.tooltip = command.tooltip;
    statusBarItem.show();
    return statusBarItem;
}

const saveState = (context: ExtensionContext, value: State): void => {
    PASStorageService.saveServerState(context, value);
}
const saveWebViewState = (context: ExtensionContext, value: WebViewState | undefined): void => {
    if (value) {
        PASStorageService.saveWebSiteViewState(context, value);
    }
}

const loadState = (context: ExtensionContext): State | undefined => {
    const state: State | undefined = PASStorageService.getServerState(context);
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

const deleteStates = (): void => {
    PASStorageService.deleteAllStates(persistContext!);
}
const saveExtensionState = (context: ExtensionContext, value: ExtensionState): void => {
    PASStorageService.saveExtensionState(context, value);
}
const getExtensionState = (context: ExtensionContext): ExtensionState | undefined => {
    return PASStorageService.getExtensionState(context);
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
    deleteStates,
    saveWebViewState,
    postMessageToWebview,
    saveExtensionState,
    getExtensionState
}