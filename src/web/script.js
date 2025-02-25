
const vscode = acquireVsCodeApi();


function bindLiveButtonEvent() {
    const liveButton = document.getElementById('pas-live-btn');
    liveButton.addEventListener('click', function () {
        console.log('Live button clicked');
        postMessageToExtension();
    });
}

function bindEvents() {
    bindLiveButtonEvent();


    const coll = document.getElementsByClassName("collapsible") || [];
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}

const api = {
    apiId: 'api-1',
    isLive: true,
    apiName: 'Get User',
    apiDescription: 'This API is used to get the user details',
    apiDetails: {
        method: 'get',
        endpoint: '/api/user',
        responseCode: '200',
        response: {
            body: {
                content: {
                    "name": "John Doe User",
                    "email": "rohit@mail.com",
                },
                type: 'application/json',
                isMandatory: true
            },
            headers: {
                "Content-Type": "application/json"
            }
        }
    }
}
const api2 = {
    apiId: 'api-1',
    isLive: true,
    apiName: 'Get User',
    apiDescription: 'This API is used to get the user details',
    apiDetails: {
        method: 'get',
        endpoint: '/api/profile',
        responseCode: '200',
        response: {
            body: {
                content: {
                    "name": "John Doe Profile",
                    "email": "rohit@mail.com",
                },
                type: 'application/json',
                isMandatory: true
            },
            headers: {
                "Content-Type": "application/json"
            }
        }
    }
}

const pasState = {
    collections: [
        {
            collectionId: 'collection-1',
            collectionName: 'Users',
            collectionDescription: 'This collection contains all the user related APIs',
            apis: [api, api2]
        }
    ]
}

function postMessageToExtension() {
    vscode.postMessage({
        command: 'saveStateAndStartServer',
        data: pasState
    });
}
document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    // const endpoint = document.getElementById('pas-endpoint');
    // endpoint.addEventListener('change', function (event) {
    //     mockAPI.apiDetails.endpoint = event.target.value;
    // }
    // );
});