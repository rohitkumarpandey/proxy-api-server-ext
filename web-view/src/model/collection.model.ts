export interface Api {
    id: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    name: string,
    url: string;
    endpoint: string,
    islive: boolean;
}

export interface Collection {
    id: string,
    name: string;
    description:string;
    api: Api[]
}
