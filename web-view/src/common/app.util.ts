import { Collection } from "../model/collection.model";
import { CONSTANT } from "./constant";

class AppUtil {
    private static generateAlphanumericString(length: number = 8): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }

    static generateId() {
        return this.generateAlphanumericString();
    }
    static generateCollectionId(): string {
        return `${CONSTANT.COLLECTION_ID_PREFIX}${this.generateId()}`;
    }
    static generateApiId(): string {
        return `${CONSTANT.API_ID_PREFIX}${this.generateId()}`;
    }
    static getNewCollection(): Collection {
        return {
            id: this.generateCollectionId(),
            name: CONSTANT.DEFAULT.COLLECTION.NAME,
            description: CONSTANT.DEFAULT.COLLECTION.DESCRIPTION,
            api: [
                {
                    id: this.generateApiId(),
                    name: CONSTANT.DEFAULT.API.NAME,
                    method: 'GET',
                    url: CONSTANT.DEFAULT.API.URL,
                    endpoint: CONSTANT.DEFAULT.API.ENDPOINT,
                    islive: CONSTANT.DEFAULT.API.IS_LIVE
                }
            ]
        };
    }
}

export default AppUtil;