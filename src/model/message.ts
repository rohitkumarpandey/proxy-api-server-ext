import { WebViewState } from "./web-state.model";

export interface MessageReceiver<T, R>{
    command: string;
    data: T;
    webViewState: R;
}