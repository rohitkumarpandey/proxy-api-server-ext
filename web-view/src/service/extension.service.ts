import { State } from "../model/api-server.model";
import { WebViewState } from "../model/web-state.model";

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();


export class ExtensionService {
    static saveWebViewState(webViewState: WebViewState) {
        vscode.postMessage({
            command: 'saveWebViewState',
            webViewState: webViewState
        });
    }
    static saveStateAndStartServer(state: State) {
        vscode.postMessage({
            command: 'saveStateAndStartServer',
            data: state
        });
    }
}