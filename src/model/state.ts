
interface ResponseDetails {
    body: {
        content: any;
        type: string;
        isMandatory: boolean;
    };
    headers: Map<string, string>;
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