import { ExtensionContext } from "vscode";
import { CONSTANT } from "./constant";
import { ExtensionState } from "../model/extension-state.model";
import { State } from "../model/state";
import { WebViewState } from "../model/web-state.model";

export class PASStorageService {
    private static saveState(context: ExtensionContext, identifier: string, value: any): void {
        context.globalState.update(identifier, value);
    }
    private static getState(context: ExtensionContext, identifier: string): any {
        return context.globalState.get(identifier);
    }
    public static deleteStatesByContext(context: ExtensionContext, stateIdentifiers: string[] = []): void {
        stateIdentifiers.forEach((identifier) => {
            context.globalState.update(identifier, undefined);
        });
    }
    public static deleteAllStates(context: ExtensionContext): void {
        return this.deleteStatesByContext(context, [CONSTANT.IDENTIFIER.GLOBAL_STATE, CONSTANT.IDENTIFIER.WEB_STATE, CONSTANT.IDENTIFIER.EXTENSION_STATE]);
    }
    public static saveExtensionState(context: ExtensionContext, value: ExtensionState): void {
        context && value && this.saveState(context, CONSTANT.IDENTIFIER.EXTENSION_STATE, value);
    }
    public static getExtensionState(context: ExtensionContext): ExtensionState | undefined {
        return this.getState(context, CONSTANT.IDENTIFIER.EXTENSION_STATE);
    }
    public static saveServerState(context: ExtensionContext, value: State): void {
        context && value && this.saveState(context, CONSTANT.IDENTIFIER.GLOBAL_STATE, value);
    }
    public static getServerState(context: ExtensionContext): State | undefined {
        return this.getState(context, CONSTANT.IDENTIFIER.GLOBAL_STATE);
    }
    public static saveWebSiteViewState(context: ExtensionContext, value: WebViewState | undefined): void {
        context && value && this.saveState(context, CONSTANT.IDENTIFIER.WEB_STATE, value);
    }
}