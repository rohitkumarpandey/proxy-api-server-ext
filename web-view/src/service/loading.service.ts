import { SubscriberService } from "./subscriber.service";

export class LoadingService {
    static show() {
        SubscriberService.showLoading();
    }
    static hide() {
        SubscriberService.hideLoading();
    }
}