interface StateApiHeaderDetails {
    name: string;
    value: string;
}
interface ResponseDetails {
    body: {
        content: any;
        type: string;
        isMandatory: boolean;
    };
    headers: StateApiHeaderDetails[];
}
export interface ApiDetails {
    method: string;
    endpoint: string;
    responseCode: string;
    response: ResponseDetails;
    latency: number;
    handler: (req: any, res: any) => void;
}
export interface Api {
    apiId: string;
    apiName: string;
    apiDescription: string;
    apiDetails: ApiDetails;
}

export interface Collection {
    id: string;
    name: string;
    apis: Api[];
}
export interface State {
    collections: Collection[];
}