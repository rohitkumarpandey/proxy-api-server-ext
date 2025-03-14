import { ApiResponseTab, Collection, HttpStatusCode, Latency, ResponseHeader } from "../model/collection.model";
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
                    islive: CONSTANT.DEFAULT.API.IS_LIVE,
                    response: {
                        code: 200,
                        status: 'SUCCESS'
                    },
                    latency: 100,
                    responseTabs: [this.getNewResponseTab()]

                }
            ]
        };
    }
    static getNewHeader(): ResponseHeader {
        return {
            key: '',
            value: '',
            description: '',
            keyPlaceholder: 'Header Key',
            valuePlaceholder: 'Header Value',
            descriptionPlaceholder: 'Description',
        };
    }
    static getNewResponseTab(): ApiResponseTab {
        return {
            id: this.generateId(),
            name: `200 ` + this.generateId(),
            httpStatus: {
                code: 200,
                status: 'SUCCESS'
            },
            responseBody: {
                contentType: 'string',
                content: ''
            },
            headers: [
                this.getNewHeader()
            ]
        };
    }

    static getAuthTypes(): { id: string, name: string }[] {
        return [
            {
                id: 'no-auth',
                name: 'No Auth'
            },
            {
                id: 'bearer-token',
                name: 'Bearer Token'
            },
            {
                id: 'jwt-token',
                name: 'JWT Token'
            }
        ];
    }

    static getLatency(): Latency[] {
        return [
            {
                value: 0,
                name: '0 ms'
            },
            {
                value: 100,
                name: '100 ms'
            },
            {
                value: 1000,
                name: '1000 ms'
            },
            {
                value: 2000,
                name: '2000 ms'
            }, {
                value: 4000,
                name: '4000 ms'
            },
            {
                value: 5000,
                name: '5000 ms'
            },

        ]
    }
    static getHttpRequests(): HttpStatusCode[] {
        return [
            {
                code: 200,
                status: 'SUCCESS'
            },
            {
                code: 400,
                status: 'BAD REQUEST'
            },
            {
                code: 500,
                status: 'INTERNAL SERVER ERROR'
            }
        ];
    }
}

export default AppUtil;