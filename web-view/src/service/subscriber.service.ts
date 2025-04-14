import { MessageType } from "../common/message-type";
import { Subject } from "rxjs/internal/Subject";
import { IMessageTypeKey } from "../model/message-type.model";

export class SubscriberService {
    private static applicationStatusSubject = new Subject<IMessageTypeKey>();

    static get applicationStatus$() {
        return this.applicationStatusSubject.asObservable();
    }
    static notifyApplicationStatus(status: IMessageTypeKey) {
        this.applicationStatusSubject.next(status);
    }
    static clearApplicationStatus() {
        this.applicationStatusSubject.next(MessageType.NO_STATUS);
    }
}