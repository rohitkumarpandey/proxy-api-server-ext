import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export class LoadingService {
    private static loadingSubject = new BehaviorSubject<boolean>(false);

    static get loading$() {
        return this.loadingSubject.asObservable();
    }
    static show() {
        this.loadingSubject.next(true);
    }
    static hide() {
        this.loadingSubject.next(false);
    }

}