import { MessageType } from "../common/message-type";
import { Subject } from "rxjs/internal/Subject";
import { IMessageTypeKey } from "../model/message-type.model";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export class SubscriberService {
    private static applicationStatusSubject = new Subject<IMessageTypeKey>();
    private static loadingSubject = new BehaviorSubject<boolean>(false);

    static get applicationStatus$() {
        return this.applicationStatusSubject.asObservable();
    }
    static get loading$() {
        return this.loadingSubject.asObservable();
    }

    static notifyApplicationStatus(status: IMessageTypeKey) {
        this.applicationStatusSubject.next(status);
    }
    static clearApplicationStatus() {
        this.applicationStatusSubject.next(MessageType.NO_STATUS);
    }

    static showLoading() {
        this.loadingSubject.next(true);
    }
    static hideLoading() {
        this.loadingSubject.next(false);

    }
}