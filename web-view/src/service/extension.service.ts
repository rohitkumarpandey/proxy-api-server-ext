import { State } from "../model/api-server.model";
import { WebViewState } from "../model/web-state.model";

declare global {
    interface Window {
        acquireVsCodeApi?: () => {
            postMessage: (message: any) => void;
            setState: (state: any) => void;
            getState: () => any;
        };
    }
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : {
    postMessage: (msg: any) => console.log("Mock postMessage:", msg),
    setState: (_: any) => { },
    getState: () => undefined,
};


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