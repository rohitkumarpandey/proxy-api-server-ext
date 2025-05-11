import path from "path";
import { ViewColumn, WebviewPanel } from "vscode";
import * as fs from 'fs';
import { ExtensionContext, Uri } from 'vscode';
import { CONSTANT } from "../common/constant";
import { MessageReceiver } from "../model/message";
import { addNewWebViewTab } from "../common/vscode-apis";
import { restartServer } from "../common/server";
import { WebViewApi, WebViewCollection, WebViewState } from "../model/web-state.model";

export class WebViewManager {
    private static instance: WebViewManager;
    private webviewPanel: WebviewPanel | undefined;
    private htmlContent: string;
    private uris: { [identifire: string]: Uri };
    private globalContext: ExtensionContext;

    private constructor(context: ExtensionContext) {
        const htmlPath = path.join(context.extensionPath, 'web-view', 'dist', 'index.html');
        this.htmlContent = fs.readFileSync(htmlPath, 'utf8');

        const scriptPathOnDisk = Uri.file(path.join(context.extensionPath, 'web-view', 'dist', 'index.js'));
        const stylePathOnDisk = Uri.file(path.join(context.extensionPath, 'web-view', 'dist', 'index.css'));
        const logoPathOnDisk = Uri.file(path.join(context.extensionPath, 'web-view', 'dist', 'logo.webp'));
        const uris: { [identifire: string]: Uri } = {};
        uris[CONSTANT.IDENTIFIER.SCRIPT_URI] = scriptPathOnDisk;
        uris[CONSTANT.IDENTIFIER.STYLE_URI] = stylePathOnDisk;
        uris[CONSTANT.IDENTIFIER.LOGO_URI] = logoPathOnDisk;
        this.uris = uris;
        this.globalContext = context;
    }

    public static initializeWebViewPanel(context: ExtensionContext): WebViewManager {
        if (!WebViewManager.instance) {
            WebViewManager.instance = new WebViewManager(context);
        }
        return WebViewManager.instance;
    }
    public static disposeAndClearWebView(): void {
        if (WebViewManager.instance) {
            WebViewManager.instance.webviewPanel = undefined;
        }
    }
    public displayWebViewPanel<T, R>(messageReceiver: (message: MessageReceiver<T, R>, context: ExtensionContext) => void, onDispose: (context: ExtensionContext) => void, onSuccess: (context: ExtensionContext) => any): void {
        if (this.checkIfWebviewIsOpen()) {
            console.log('Webview is already open. Reusing the existing webview.');
            this.displayExisitngWebView(this.globalContext);
            restartServer(this.globalContext);
        } else {
            console.log('Creating a new webview panel.');
            this.webviewPanel = addNewWebViewTab(CONSTANT.EXTENSION.STATUSBAR_BUTTON, CONSTANT.EXTENSION.TITLE, this.htmlContent, this.globalContext, this.uris, messageReceiver, {
                command: 'loadWebViewState',
                data: (context: ExtensionContext) => this.loadWebViewState(context)
            }, onDispose);
            onSuccess(this.globalContext);
        }
    }

    public getWebviewPanel(): WebviewPanel | undefined {
        return this.webviewPanel;
    }
    private checkIfWebviewIsOpen(): boolean {
        return this.webviewPanel !== undefined;
    }

    private displayExisitngWebView(context: ExtensionContext): void {
        if (this.webviewPanel) {
            this.webviewPanel.reveal(ViewColumn.One);
            this.webviewPanel.webview.postMessage({
                command: 'loadWebViewState',
                data: this.loadWebViewState(context, false)
            });
        }
    }
    private loadWebViewState(context: ExtensionContext, loadingFirstTime: boolean = true): WebViewState | undefined {
        const state: WebViewState | undefined = context.globalState.get(CONSTANT.IDENTIFIER.WEB_STATE);
        console.log('Loading web view state:', state);
        if (state?.collections && loadingFirstTime) {
            state.collections.forEach((collection: WebViewCollection) => {
                collection.api.forEach((api: WebViewApi) => {
                    api.islive = false; // Set `islive` to false for each API
                });
            });
        }
        return state;
    }
}