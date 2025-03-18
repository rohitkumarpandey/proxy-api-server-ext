import { State } from "../model/api-server.model";

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();


export class ExtensionService {
    static saveStateAndStartServer(state: State) {
        vscode.postMessage({
            command: 'saveStateAndStartServer',
            data: state
        });
    }
}