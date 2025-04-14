import { Api, ApiResponseTab, Collection, HttpStatusCode, Latency, ResponseHeader } from "../model/collection.model";
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
                this.getNewApi()
            ]
        };
    }
    static getNewApi(): Api {
        const defaultResponse = this.getNewResponseTab();
        return {
            id: this.generateApiId(),
            name: CONSTANT.DEFAULT.API.NAME,
            method: 'get',
            url: CONSTANT.DEFAULT.API.URL,
            endpoint: CONSTANT.DEFAULT.API.ENDPOINT,
            islive: CONSTANT.DEFAULT.API.IS_LIVE,
            latency: 0,
            responseTabs: [defaultResponse],
            response: defaultResponse
        }
    }
    static getNewHeader(): ResponseHeader {
        return {
            key: '',
            value: '',
            description: '',
            keyPlaceholder: 'Header Key',
            valuePlaceholder: 'Header Value',
            descriptionPlaceholder: 'Description',
            isChecked: true
        };
    }
    static getNewResponseTab(): ApiResponseTab {
        return {
            id: this.generateId(),
            name: 'Response',
            httpStatus: {
                code: 200,
                status: 'OK'
            },
            responseBody: {
                contentType: 'json',
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
                value: 500,
                name: '500 ms'
            },
            {
                value: 1000,
                name: '1000 ms'
            },
            {
                value: 1500,
                name: '1500 ms'
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
            {
                value: 10000,
                name: '10000 ms'
            }

        ]
    }
    static getHttpRequests(): HttpStatusCode[] {
        return [
            {
                code: 200,
                status: 'OK'
            },
            {
                code: 201,
                status: 'CREATED'
            },
            {
                code: 204,
                status: 'NO CONTENT'
            },
            {
                code: 400,
                status: 'BAD REQUEST'
            },
            {
                code: 401,
                status: 'UNAUTHORIZED'
            },
            {
                code: 403,
                status: 'FORBIDDEN'
            },
            {
                code: 404,
                status: 'NOT FOUND'
            },
            {
                code: 500,
                status: 'INTERNAL SERVER ERROR'
            },
            {
                code: 502,
                status: 'BAD GATEWAY'
            },
            {
                code: 503,
                status: 'SERVICE UNAVAILABLE'
            }
        ];
    }

    static getHttpRequest(code: number): HttpStatusCode {
        return this.getHttpRequests().find(req => req.code == code) || { code: 200, status: 'OK' };
    }
}

export default AppUtil;