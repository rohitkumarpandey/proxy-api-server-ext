
//const vscode = acquireVsCodeApi() || {};



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
const pasState = {
    collections: [
        {
            collectionId: 'collection-1',
            collectionName: 'Users',
            collectionDescription: 'This collection contains all the user related APIs',
            apis: [api]
        }
    ]
}
function bindEndPointInputEvent() {
    const endpointInput = document.getElementById('pas-url-endpoint');
    endpointInput.addEventListener('input', function (event) {
        api.apiDetails.endpoint = event.target.value;
    }
    );
}
function bindLiveButtonEvent() {
    const liveButton = document.getElementById('pas-live-btn');
    liveButton.addEventListener('click', function () {
        console.log('Live button clicked');
        postMessageToExtension();
    });
}

function bindEvents() {
    bindLiveButtonEvent();
    bindEndPointInputEvent();

    const coll = document.getElementsByClassName("collapsible");
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


// const api2 = {
//     apiId: 'api-1',
//     isLive: true,
//     apiName: 'Get User',
//     apiDescription: 'This API is used to get the user details',
//     apiDetails: {
//         method: 'get',
//         endpoint: '/api/profile',
//         responseCode: '200',
//         response: {
//             body: {
//                 content: {
//                     "name": "John Doe Profile",
//                     "email": "rohit@mail.com",
//                 },
//                 type: 'application/json',
//                 isMandatory: true
//             },
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         }
//     }
// }


function changeRequestType(event) {
    api.apiDetails.method = event.target.value;;
}
function changeResponseStatus(event) {
    api.apiDetails.responseCode= event.target.value;
}
function updateResponse(event) {
    api.apiDetails.response.body.content = JSON.parse(event.target.outerText);
}
function postMessageToExtension() {
    vscode.postMessage({
        command: 'saveStateAndStartServer',
        data: pasState
    });
}

function addCollection(){
    const collectionInput = document.getElementById("add-collection-input");
    if (collectionInput && collectionInput.value) {
        pasState.collections.push({
            collectionId: 'collection-1',
            collectionDescription: 'hey'
        })
    }
    console.log(pasState)
}
function addCollectionForm() {
    const collectionInputContainer = document.getElementById("pas-collection-input");
    if (collectionInputContainer) {
        collectionInputContainer.style.display = 'flex';
    }
}
function clearAndCloseNewCollection() {
    const collectionInput = document.getElementById("add-collection-input");
    const collectionInputContainer = document.getElementById("pas-collection-input");
    
    if(collectionInput) {
        collectionInput.value = '';
        collectionInputContainer.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
});