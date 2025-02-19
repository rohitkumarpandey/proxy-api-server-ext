
import * as vscode from 'vscode';
import { Command, CommandDetails } from '../model/command';

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

const addNewWebViewTab = (id: string, title: string, content: string, context: vscode.ExtensionContext, ...uris: { script?: vscode.Uri, style?: vscode.Uri }[]): void => {
    const panel = vscode.window.createWebviewPanel(
        id,
        title,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
        }
    );
    if (uris.length > 0) {
        uris.forEach(uri => {
            if (uri.script) {
                const scriptUri = panel.webview.asWebviewUri(uri.script);
                content = content.replace('%SCRIPT_URI%', scriptUri.toString());
            }
            if (uri.style) {
                const styleUri = panel.webview.asWebviewUri(uri.style);
                content = content.replace('%STYLE_URI%', styleUri.toString());
            }
        });
    }
    panel.webview.html = content;
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'callTypeScriptMethod':
                    callTypeScriptMethod(message.text);
                    return;
            }
        },
        undefined,
        context.subscriptions
    );
}
const callTypeScriptMethod = (text: string) => {
    vscode.window.showInformationMessage(`Called from JavaScript: ${text}`);
}

const addStatusBarItem = (alignment: vscode.StatusBarAlignment, priority: number, command: CommandDetails): vscode.StatusBarItem => {
    const statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    statusBarItem.text = command.title;
    statusBarItem.command = command.name;
    statusBarItem.tooltip = command.tooltip;
    statusBarItem.show();
    return statusBarItem;
}

export {
    toastMessage,
    registerCommands,
    addNewWebViewTab,
    addStatusBarItem
}