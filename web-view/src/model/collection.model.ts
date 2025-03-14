export interface Latency {
    name: string,
    value: number
}
export interface HttpStatusCode {
    code: 200 | 400 | 500;
    status: 'SUCCESS' | 'BAD REQUEST' | 'INTERNAL SERVER ERROR'
}
export interface ResponseBody {
    contentType: 'none' | 'string' | 'json';
    content: string;
}
export interface ResponseHeader {
    key: string,
    value: string,
    description?: string,
    keyPlaceholder?: string,
    valuePlaceholder?: string,
    descriptionPlaceholder?: string,
}
export interface ApiResponseTab {
    id: string;
    name: string,
    httpStatus: HttpStatusCode,
    responseBody: ResponseBody,
    headers: ResponseHeader[]
}

export interface Api {
    id: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    name: string,
    url: string;
    endpoint: string,
    islive: boolean;
    response: HttpStatusCode;
    latency: number;
    responseTabs: ApiResponseTab[]
}

export interface Collection {
    id: string,
    name: string;
    description: string;
    api: Api[]
}
