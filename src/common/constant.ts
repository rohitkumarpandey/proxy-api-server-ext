import { Command } from "../model/command"
import { loadLandingTab } from "./app";
import { startServer, startStopServer, stopServer } from "./server"
import { ExtensionContext } from 'vscode';

const extensionName = require('../../package.json').name;

export const COMMAND: Command = {
    START_SERVER: { name: `${extensionName}.startServer`, callback: () => { return () => startServer() }, title: "Start Server" },
    STOP_SERVER: { name: `${extensionName}.stopServer`, callback: () => { return () => stopServer() }, title: "Stop Server" },
    START_STOP_SERVER: { name: `${extensionName}.startStopServer`, callback: () => { return () => startStopServer() }, title: "Start/Stop Server", tooltip: "Click to start or stop the server" },
    LANDING_TAB: { name: `${extensionName}.landingTab`, callback: (context: ExtensionContext) => { return () => loadLandingTab(context); }, title: "Proxy API Server", tooltip: "Open Proxy API Server" }
}