import * as http from 'http';
import * as vscodeApi from './vscode-apis';
import * as vscode from 'vscode';
import express from 'express';
import { Api, Collection, State } from '../model/state';
const PORT = 5256;

let server: http.Server;
const app = express();
let appState: State | undefined;
app.get('/', (req, res) => {
    const liveApis: string[] = [];
    appState && appState.collections.forEach((collection: Collection) => {
        collection.apis.forEach((api: Api) => {
            if (api.isLive) {
                liveApis.push(api.apiDetails.endpoint);
            }
        });
    });
    res.status(200).json({ message: 'Server is running', liveApis });
});

function loadState(context: vscode.ExtensionContext): State | undefined {
    appState = vscodeApi.loadState(context);
    return appState;
}

function loadApis(context: vscode.ExtensionContext) {
    const state: State | undefined = appState || loadState(context);
    if (state && state.collections) {
        state.collections.forEach((collection: Collection) => {
            collection.apis.forEach((api: Api) => {
                console.log(api.apiDetails.handler);
                (app as any)[api.apiDetails.method](api.apiDetails.endpoint, api.apiDetails.handler);
            });
        });
    }
}

const startServer = (context: vscode.ExtensionContext) => {
    if (isServerRunning()) {
        stopServer(context);
    }
    loadApis(context);
    server = app.listen(PORT, 'localhost', () => {
        vscodeApi.toastMessage(`Server started on http://localhost:${PORT}`);
    });
}

const stopServer = (context: vscode.ExtensionContext) => {
    if (server) {
        server.close(() => {
            vscodeApi.toastMessage('Server stopped');
        });
    }
}

const startStopServer = (context: vscode.ExtensionContext) => {
    server && server.listening ? stopServer(context) : startServer(context);
}

const restartServer = (context: vscode.ExtensionContext) => {
    stopServer(context);
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