export interface IMessageTypeKey {
    code: string;
    message: string;
    messageType: 'info' | 'error' | 'success' | 'warning' | '';
}
export interface IMessageType {
    [key: string]: IMessageTypeKey;
}