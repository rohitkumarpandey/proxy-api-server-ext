import { IMessageType } from "../model/message-type.model";

export const MessageType: IMessageType = {
    NO_STATUS: {
        code: 'NO_STATUS',
        message: '',
        messageType: ''
    },
    LOADING: {
        code: 'LOADING',
        message: 'Loading...',
        messageType: 'info'
    },
    APP_LIVE: {
        code: 'APP_LIVE',
        message: 'Application server is live now!',
        messageType: 'success'
    },
    APP_RESTARTING: {
        code: 'APP_RESTARTING',
        message: 'Application server is restarting...',
        messageType: 'info'
    },
    APP_STOPPED: {
        code: 'APP_STOPPED',
        message: 'Application server is stopped!',
        messageType: 'warning'
    },
    ERROR: {
        code: 'ERROR',
        message: 'Error occurred',
        messageType: 'error'
    }
}