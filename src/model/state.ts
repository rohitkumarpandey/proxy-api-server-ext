
interface ResponseDetails {
    body: {
        content: any;
        type: string;
        isMandatory: boolean;
    };
    headers: Map<string, any>;
}
export interface ApiDetails {
    method: string;
    endpoint: string;
    responseCode: string;
    response: ResponseDetails;
    handler: (req: any, res: any) => void;
}
export interface Api {
    apiId: string;
    isLive: boolean;
    apiName: string;
    apiDescription: string;
    apiDetails: ApiDetails;
}

export interface Collection {
    name: string;
    apis: any[];
}
export interface State {
    collections: Collection[];
}