
import * as vscode from 'vscode';
import { Command, CommandDetails } from '../model/command';
import { CONSTANT } from './constant';
import { State, Collection, Api } from '../model/state';
import { MessageReceiver } from '../model/message';
const toastMessage = (message: string): void => {
    vscode.window.showInformationMessage(message);
}

const registerCommands = (command: Command, context: vscode.ExtensionContext): vscode.Disposable[] => {
    const disposables: vscode.Disposable[] = [];
    Object.keys(command).forEach(key => {
        const com = command[key];
        disposables.push(vscode.commands.registerCommand(com.name, com.callback(context)));
    });
    return disposables;
}

const addNewWebViewTab = <T>(id: string, title: string, content: string, context: vscode.ExtensionContext, uris: { [identifier: string]: vscode.Uri },
    messageReceiver: (message: MessageReceiver<T>) => void
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
    //TODO: Add icon to the webview
    //panel.iconPath = vscode.Uri.file(context.asAbsolutePath('src/assets/logo.png'));

    if (uris && Object.keys(uris).length > 0) {
        Object.keys(uris).forEach(key => {
            const uri = uris[key];
            const scriptUri = panel.webview.asWebviewUri(uri);
            content = content.replace(key, scriptUri.toString());
        });
    }
    panel.webview.html = content;
    panel.webview.onDidReceiveMessage(
        (message: MessageReceiver<T>) => {
            messageReceiver(message);
        },
        undefined,
        context.subscriptions
    );
    panel.onDidDispose(() => {
        // When the panel is closed, cancel any future updates to the webview content
    }
    );
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
const loadState = (context: vscode.ExtensionContext): State | undefined => {
    const state: State | undefined = context.globalState.get(CONSTANT.IDENTIFIER.GLOBAL_STATE);
    state && state.collections.forEach((collection: Collection) => {
        collection.apis.forEach((api: Api) => {
            api.apiDetails.handler = (req: any, res: any) => {
                res.status(api.apiDetails.responseCode)['json'](api.apiDetails.response.body.content);
            }
        });
    });
    return state;
}
const deleteState = (context: vscode.ExtensionContext): Thenable<void> => {
    return context.globalState.update('pas-state', undefined);
}

export {
    toastMessage,
    registerCommands,
    addNewWebViewTab,
    addStatusBarItem,
    loadState,
    saveState
}