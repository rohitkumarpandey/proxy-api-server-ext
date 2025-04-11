export const CONSTANT = {
    COLLECTION_ID_PREFIX: 'collectionId-',
    API_ID_PREFIX: 'apiId-',
    DEFAULT: {
        COLLECTION: {
            NAME: 'New Collection',
            DESCRIPTION: 'New Collection'
        },
        API: {
            NAME: 'New Request',
            URL: 'http://localhost:5256',
            METHOD: 'get',
            ENDPOINT: '',
            IS_LIVE: false,
            LATENCY: 0,
            RESPONSE: {
                code: 200,
                status: 'SUCCESS'
            },
            RESPONSE_TABS: [
                {
                    httpStatus: {
                        code: 200,
                        status: 'SUCCESS'
                    },
                    responseBody: [
                        {
                            contentType: 'none',
                            content: ''
                        }
                    ],
                    headers: [
                        {
                            key: '',
                            value: ''
                        }
                    ]
                }
            ]

        }
    }
}