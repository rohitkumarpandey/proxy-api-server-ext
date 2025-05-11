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
    APP_STARTING: {
        code: 'APP_STARTING',
        message: 'Application server is starting...',
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
    APP_SERVER_ERROR: {
        code: 'APP_SERVER_ERROR',
        message: 'Error occurred while starting the server!',
        messageType: 'error'
    },
    ERROR: {
        code: 'ERROR',
        message: 'Error occurred',
        messageType: 'error'
    }
}