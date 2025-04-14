import * as http from 'http';
import * as vscodeApi from './vscode-apis';
import * as vscode from 'vscode';
import express from 'express';
import { Api, Collection, State } from '../model/state';
const PORT = 5256;

let server: http.Server;
let app = express();
function loadState(context: vscode.ExtensionContext): State | undefined {
    return vscodeApi.loadState(context);
}

function loadApis(context: vscode.ExtensionContext) {
    app = express();
    const state: State | undefined = loadState(context);
    if (state && state.collections) {
        state.collections.forEach((collection: Collection) => {
            collection.apis.forEach((api: Api) => {
                (app as any)[api.apiDetails.method](api.apiDetails.endpoint, api.apiDetails.handler);
            });
        });
    }
    app.get('/pas/status', (req, res) => {
        const liveApis: string[] = [];
        state && state.collections.forEach((collection: Collection) => {
            collection.apis.forEach((api: Api) => {
                liveApis.push(api.apiDetails.endpoint || '/');
            });
        });
        res.status(200).json({ message: 'Server is running', port: PORT, baseUrl: `http://localhost:${PORT}`, liveApis });
    });
}

const startServer = (context: vscode.ExtensionContext) => {
    if (isServerRunning()) {
        stopServer(context);
    }
    loadApis(context);
    server = app.listen(PORT, 'localhost', () => {
        vscodeApi.toastMessage(`Server started on http://localhost:${PORT}`);
        vscodeApi.postMessageToWebview('serverStarted');
    });
}

const stopServer = (context: vscode.ExtensionContext, isRestart: boolean = false) => {
    if (isServerRunning()) {
        server && server.close(() => {
            if (!isRestart) {
                vscodeApi.toastMessage('Server stopped');
                vscodeApi.postMessageToWebview('serverStopped');
            } else {
                vscodeApi.postMessageToWebview('serverRestarting');
            }
        });
    }
}

const startStopServer = (context: vscode.ExtensionContext) => {
    server && server.listening ? stopServer(context) : startServer(context);
}

const restartServer = (context: vscode.ExtensionContext) => {
    stopServer(context, true);
    setTimeout(() => {
        startServer(context);
    }, 1000);
}

const isServerRunning = () => {
    return server && server.listening;
}

export {
    startServer,
    stopServer,
    startStopServer,
    restartServer,
    isServerRunning
};