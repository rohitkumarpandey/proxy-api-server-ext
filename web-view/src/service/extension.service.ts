declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

export class ExtensionService {
    static saveStateAndStartServer(pasState: any) {
        vscode.postMessage({
            command: 'saveStateAndStartServer',
            data: pasState
        });
    }
}