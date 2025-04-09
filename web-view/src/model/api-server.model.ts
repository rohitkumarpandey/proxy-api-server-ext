
export interface StateApiResponseBodyDetails {
    content: any;
    type: string | undefined;
    isMandatory?: boolean;
}
export interface StateApiHeaderDetails {
    name: string;
    value: string;
}
export interface StateApiResponseDetails {
    body: StateApiResponseBodyDetails;
    headers: StateApiHeaderDetails[];
}
export interface StateApiDetails {
    method: string;
    endpoint: string;
    responseCode: number;
    latency: number;
    response: StateApiResponseDetails;
    handler?: (req: any, res: any) => void;
}
export interface StateApi {
    apiId: string;
    isLive: boolean;
    apiName: string;
    apiDescription?: string;
    apiDetails: StateApiDetails;
}

export interface StateCollection {
    id: string;
    name: string;
    apis: StateApi[];
}
export interface State {
    collections: StateCollection[];
}