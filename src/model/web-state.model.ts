interface Latency {
    name: string,
    value: number
}
interface HttpStatusCode {
    code: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500 | 502 | 503;
    status: 'OK' | 'CREATED' | 'NO CONTENT' | 'BAD REQUEST' |  'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT FOUND' | 'INTERNAL SERVER ERROR' | 'BAD GATEWAY' | 'SERVICE UNAVAILABLE';
}
interface ResponseBody {
    contentType: 'none' | 'string' | 'json';
    content: string;
}
interface ResponseHeader {
    key: string,
    value: string,
    description?: string,
    keyPlaceholder?: string,
    valuePlaceholder?: string,
    descriptionPlaceholder?: string,
}
interface ApiResponseTab {
    id: string;
    name: string,
    httpStatus: HttpStatusCode,
    responseBody: ResponseBody,
    headers: ResponseHeader[]
}

export interface WebViewApi {
    id: string,
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    name: string,
    url: string;
    endpoint: string,
    islive: boolean;
    response: ApiResponseTab;
    latency: number;
    responseTabs: ApiResponseTab[]
}

export interface WebViewCollection {
    id: string,
    name: string;
    description: string;
    api: WebViewApi[]
}

export interface WebViewState {
    collections: WebViewCollection[];
}
