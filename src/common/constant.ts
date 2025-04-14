import { Command } from "../model/command"
import { loadLandingTab } from "./app";
import { startServer, startStopServer, stopServer } from "./server"
import { ExtensionContext } from 'vscode';

const app = require('../../package.json');

const tooltip = {
    START_SERVER: "Click to start the server",
    STOP_SERVER: "Click to stop the server",
    START_STOP_SERVER: "Click to start or stop the server",
    LANDING_TAB: "Click to open Proxy API Server"
}
const extension = {
    TITLE: app.displayName,
    NAME: app.name,
    STATUSBAR_BUTTON: 'landingTab'
}
export const CONSTANT = {
    EXTENSION: extension,
    TOOLTIP: tooltip,
    IDENTIFIER: {
        SCRIPT_URI: '/index.js',
        STYLE_URI: '/index.css',
        LOGO_URI: '/logo.webp',
        GLOBAL_STATE: 'pas-state',
        WEB_STATE: 'pas-web-state',
        EXTENSION_STATE: 'pas-extension-state',
    }
}

export const COMMAND: Command = {
    START_SERVER: { name: `${CONSTANT.EXTENSION.NAME}.start-server`, callback: (context: ExtensionContext) => { return () => loadLandingTab(context) }, title: "Start Server" },
    STOP_SERVER: { name: `${CONSTANT.EXTENSION.NAME}.stopServer`, callback: (context: ExtensionContext) => { return () => stopServer(context) }, title: "Stop Server" },
    START_STOP_SERVER: { name: `${CONSTANT.EXTENSION.NAME}.startStopServer`, callback: (context: ExtensionContext) => { return () => startStopServer(context) }, title: "Start/Stop Server", tooltip: "Click to start or stop the server" },
    LANDING_TAB: { name: `${CONSTANT.EXTENSION.NAME}.landingTab`, callback: (context: ExtensionContext) => { return () => loadLandingTab(context); }, title: `$(arrow-swap) Proxy API Server`, tooltip: CONSTANT.TOOLTIP.LANDING_TAB }
}
