import { ExtensionContext } from 'vscode';

export interface CommandDetails {
    name: string;
    callback: (context: ExtensionContext) => any;
    title: string;
    tooltip?: string;
}

export interface Command {
    [key: string]: CommandDetails;
}