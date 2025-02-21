export interface MessageReceiver<T>{
    command: string;
    data: T;
}