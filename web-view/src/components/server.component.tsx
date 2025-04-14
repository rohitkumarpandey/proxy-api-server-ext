import React, { useState, useRef, useEffect } from 'react';
import Button from './button.component';
import { useLocation } from 'react-router-dom';
import { Api, ApiResponseTab, HttpStatusCode, ResponseHeader } from '../model/collection.model';
import AppUtil from '../common/app.util';
import JsonEditor from './json-editor.component';
import { CONSTANT, CONSTRAINT } from '../common/constant';

interface ServerComponentProps {
    apiServerHandler: (collectionId: string, api: Api) => void;
    apiChangeHandler: (collectionId: string, api: Api) => void;
}

const ServerComponent: React.FC<ServerComponentProps> = ({ apiServerHandler, apiChangeHandler }) => {
    const location = useLocation();
    const collectiondId: string = location.state?.collectionId;
    const [api, updateApi] = useState<Api>(location.state?.api as Api);
    const [activeTab, setResponseTab] = useState<string>('');
    const [activeResponseContent, setResponseContent] = useState<string>('');
    const [isInvalidJSON, setInvalidJSON] = useState<boolean>(false);
    const [apiResponseTabId, setApiResponseTabId] = useState<string>('');

    const jsonEditorRef = useRef<{ formatJson: () => boolean }>(null);
    useEffect(() => {
        if (location.state?.api) {
            updateApi(location.state.api);
            const defaultActiveTab = location.state.api.response.id || location.state.api.responseTabs[0].id;
            handleApiResponse(defaultActiveTab);
            setResponseTab(defaultActiveTab);
            setApiResponseTabId(defaultActiveTab);
            setResponseContent(`response-body-${defaultActiveTab}`);
        }
    }, [location.state?.api]);

    const normalizeEndpoint = (endpoint: string): string => {
        // Remove extra forward slashes and ensure it starts with a single forward slash
        return '/' + endpoint.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
    };

    const handleServerEndpointChange = (endpoint: string) => {
        const normalizedEndpoint = normalizeEndpoint(endpoint);
        const updatedApi = { ...api, endpoint: normalizedEndpoint };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    };

    function renderResponseTab(tabId: string) {
        setResponseTab(tabId);
        renderResponseContent(`response-body-${tabId}`);
    }

    function renderResponseContent(contentId: string) {
        setResponseContent(contentId);
    }

    function addNewResponseTab(): void {
        const newTab = AppUtil.getNewResponseTab();
        // update tab name
        let count = 1;
        const tabNameRegex: RegExp = new RegExp(`^${newTab.name} \\(\\d+\\)$`);
        const regex = /\((\d+)\)/;
        api.responseTabs.forEach(tab => {
            if (tabNameRegex.test(tab.name)) {
                if (tab.name.match(regex)) {
                    count = Math.max(count, parseInt(tab.name.match(regex)![1]));
                }
            }
        });
        newTab.name = `${newTab.name}${count > 0 ? ` (${count + 1})` : ''}`;
        api.responseTabs.push(newTab);
        updateApi(api);
        renderResponseTab(newTab.id);
        apiChangeHandler(collectiondId, api);
    }

    function removeResponeTab(tabId: string) {
        const filteredApi = api.responseTabs.filter(tab => tab.id != tabId);
        const updatedApi = { ...api, responseTabs: [...filteredApi] };
        updateApi(updatedApi);
        const lastResponseTabId = updatedApi.responseTabs.slice(-1).at(0)?.id;
        if (lastResponseTabId) {
            renderResponseTab(lastResponseTabId);
        }
        apiChangeHandler(collectiondId, updatedApi);
    }

    function handleHeaderInput(tabId: string, headerIndex: number, updatedheader: ResponseHeader): void {
        const updatedTabs: ApiResponseTab[] = api.responseTabs.map(tab => {
            if (tab.id === tabId) {
                const headersSize: number = tab?.headers?.length || 0;
                const updatedHeaders = tab?.headers?.map((header, index) => {
                    if (index === headerIndex) {
                        return { ...header, ...updatedheader };
                    }
                    return header;
                });
                if (headersSize === headerIndex + 1) {
                    updatedHeaders && updatedHeaders.push(AppUtil.getNewHeader());
                }
                return { ...tab, headers: updatedHeaders };
            }
            return tab;
        });
        const updatedApi = { ...api, responseTabs: updatedTabs };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    }

    function handleResponseInput(tabId: string, value: string, contentType: 'string' | 'json' | 'none' = 'json'): void {
        let formattedValue = value;
        try {
            const jsonObject = JSON.parse(value);
            formattedValue = JSON.stringify(jsonObject, null, 2);
        } catch (error) {
            formattedValue = value;
        }

        const updatedTabs: ApiResponseTab[] = api.responseTabs.map(tab => {
            if (tab.id === tabId) {
                tab.responseBody = {
                    contentType: contentType,
                    content: formattedValue
                };
            }
            return tab;
        });
        const updatedApi = { ...api, responseTabs: updatedTabs };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    }

    function handleResponseStatusCode(tabId: string, statusCode: HttpStatusCode['code']): void {
        const updatedTabs: ApiResponseTab[] = api.responseTabs.map(tab => {
            if (tab.id === tabId) {
                tab.httpStatus = AppUtil.getHttpRequest(statusCode);
                if (tab.name == `${tab.httpStatus.status}`) {
                    tab.name = `${tab.httpStatus.status}`;
                }
            }
            return tab;
        });
        const updatedApi = { ...api, responseTabs: updatedTabs };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    }

    const handleBeautifyClick = () => {
        if (jsonEditorRef.current) {
            const isFormatted: boolean = jsonEditorRef.current.formatJson();
            if (!isFormatted) {
                setInvalidJSON(true);
            } else {
                setInvalidJSON(false);
            }
        }
    };

    const addToServer = (reload: boolean = false) => {
        if (!api.islive || reload) {
            const responseTab: ApiResponseTab | undefined = api.responseTabs.find(tab => tab.id === apiResponseTabId);
            if (responseTab) {
                const updatedApi = { ...api, response: responseTab, islive: true };
                updateApi(updatedApi);
                apiServerHandler(collectiondId, updatedApi);
            }
        }
    }

    const removeFromServer = () => {
        if (api.islive) {
            const updatedApi = { ...api, islive: false };
            updateApi(updatedApi);
            apiServerHandler(collectiondId, updatedApi);
        }
    }

    function handleRequestType(value: Api['method']): void {
        const updatedApi = { ...api, method: value };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    }

    function handleApiResponse(tabId: string): void {
        const responseTab: ApiResponseTab | undefined = api.responseTabs.find(tab => tab.id === tabId);
        if (responseTab) {
            const updatedApi = { ...api, response: responseTab };
            updateApi(updatedApi);
            setApiResponseTabId(tabId);
            setResponseTab(tabId);
            renderResponseTab(tabId);
            apiChangeHandler(collectiondId, updatedApi);
        }
    }

    function handleApiLatency(latency: number): void {
        if (latency) {
            const updatedApi = { ...api, latency: latency };
            updateApi(updatedApi);
            apiChangeHandler(collectiondId, updatedApi);
        }
    }

    function handleTabNameChange(id: string, value: string): void {
        const updatedTabs: ApiResponseTab[] = api.responseTabs.map(tab => {
            if (tab.id === id) {
                return { ...tab, name: value };
            }
            return tab;
        });
        const updatedApi = { ...api, responseTabs: updatedTabs };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    }

    function handleApiNameChange(apiName: string, onBlur: boolean = false): void {
        if (onBlur && apiName === '') {
            apiName = CONSTANT.DEFAULT.API.NAME;
        }
        const updatedApi = { ...api, name: apiName };
        updateApi(updatedApi);
        apiChangeHandler(collectiondId, updatedApi);
    }

    return (
        <>
            <div className="server-container">
                <div className='server-form-container'>
                    <div className='server-request-config-container'>
                        <div className='server-breadcrumb'>
                            New Collection /<input value={`${api.name}`} maxLength={CONSTRAINT.INPUT.SERVER.API_NAME} onChange={(e) => handleApiNameChange(e.target.value)} onBlur={(e) => handleApiNameChange(e.target.value, true)}></input>
                        </div>
                        <div key={`${api.id}-server-url-container`} className="server-url-container">
                            <select name={`${api.id}-server-request-type`} id={`${api.id}-server-request-type`} className="server-request-type-select"
                                defaultValue={api.method} onChange={(e) => handleRequestType(e.target.value as Api['method'])}>
                                <option className="request-type-get" value="get">GET</option>
                                <option className="request-type-post" value="post">POST</option>
                                <option className="request-type-put" value="put">PUT</option>
                                <option className="request-type-post" value="patch">PATCH</option>
                                <option className="request-type-delete" value="delete">DELETE</option>
                            </select>
                            <input type="text" className="server-url-domain" value="http://localhost" disabled></input>
                            <input type="text" className="server-url-port" value="5256" disabled></input>
                            <input id="pas-url-endpoint" name="server-url-endpoint" type="text" className="server-url-endpoint"
                                value={api.endpoint} onChange={(e) => handleServerEndpointChange(e.target.value)} placeholder="Enter the endpoint starting with /"></input>
                            <div className="live-server-button">
                                {!api.islive && <Button label='Live' type='secondary' size='lg' handler={() => { addToServer() }} />}
                                {api.islive &&
                                    <>
                                        <Button label='Reload' type='primary' size='sm' handler={() => { addToServer(true) }} />
                                        <Button label='Stop' type='secondary' size='sm' handler={() => { removeFromServer() }} />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div key={`${api.id}-response-container`} className='server-response-container'>
                        <div className='server-response-status'>
                            <div className='d-flex align-items-center'>
                                API Response:
                                <select defaultValue={api.response.id} onChange={(e) => handleApiResponse(e.target.value)}>
                                    {api.responseTabs.map(tab => (
                                        <option key={`${tab.id}-${tab.name}`} value={tab.id}>{tab.httpStatus.code} | {tab.name || tab.httpStatus.status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='server-response-latency'>
                                Latency:
                                <select defaultValue={api.latency} onChange={(e) => handleApiLatency(e.target.value as unknown as number)}>
                                    {AppUtil.getLatency().map(latency => (
                                        <option key={`${api.id}-${latency.value}`} value={latency.value}>{latency.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='response-type-tab-container'>
                            <div className='d-flex'>
                                {api.responseTabs && api?.responseTabs.map(tab => (
                                    <div key={`${api.id}-${tab.id}`} className={`response-type-tab ${activeTab === tab.id ? 'active-tab' : ''}`}>
                                        <div className="tab-label"
                                            onClick={() => renderResponseTab(tab.id)}
                                        >{`${tab.httpStatus.code} | ${tab.name || tab.httpStatus.status}`}</div>
                                        {api.responseTabs.length > 1 && <div className="close-tab" onClick={() => { removeResponeTab(tab.id) }}>+</div>}
                                    </div>
                                ))
                                }
                                <div className="new-response-type-tab-btn" onClick={addNewResponseTab}>+</div>
                            </div>
                        </div>
                        {api.responseTabs && api.responseTabs.map((tab) => (
                            <>

                                {<div className={`${activeTab == tab.id ? '' : 'd-none'} h-100 response-tab-container`} key={tab.id}>
                                    <div className='response-tab-name-input-container'>
                                        <input maxLength={CONSTRAINT.INPUT.SERVER.RESPONSE.TAB.NAME} value={tab.name} onChange={(e) => handleTabNameChange(tab.id, e.target.value)}></input>
                                    </div>
                                    <div id={`#response-${tab.httpStatus.code}-${tab.httpStatus.status}`} className={`response-body-config`}>
                                        <div className={`${activeResponseContent == `response-body-${tab.id}` ? 'active-content-tab' : ''}`} onClick={() => renderResponseContent(`response-body-${tab.id}`)}>Body</div>
                                        <div className={`${activeResponseContent == `response-headers-${tab.id}` ? 'active-content-tab' : ''}`} onClick={() => renderResponseContent(`response-headers-${tab.id}`)}>Headers</div>
                                    </div>
                                    <div className='response-body'>
                                        <div id={`body-${tab.id}`} className={`${activeResponseContent == `response-body-${tab.id}` ? 'h-100' : 'd-none'}`}>
                                            <div className='response-data-type-config'>
                                                <div className='response-data-type'></div>
                                                <div className='response-status-select d-flex align-items-center'>
                                                    Response Status:
                                                    <select defaultValue={tab.httpStatus.code} onChange={(e) => { handleResponseStatusCode(tab.id, e.target.value as unknown as HttpStatusCode['code']) }}>
                                                        {AppUtil.getHttpRequests().map(req => (
                                                            <option key={`${tab.id}-${req.code}`} value={req.code}>{`${req.code} ${req.status}`}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='response-data-type-formatter'>
                                                    <div onClick={handleBeautifyClick}>Beautify</div>
                                                </div>
                                            </div>
                                            <div className='response-body-content-container'>
                                                <JsonEditor
                                                    ref={jsonEditorRef}
                                                    initialJson={tab.responseBody.content}
                                                    onChange={(newJson) => handleResponseInput(tab.id, newJson, tab.responseBody.contentType)}
                                                />
                                                <div className={`invalid-json ${isInvalidJSON ? '' : 'd-none'}`}></div>
                                            </div>
                                        </div>
                                        <div id={`headers-${tab.id}`} className={`${activeResponseContent == `response-headers-${tab.id}` ? '' : 'd-none'}`}>
                                            <div className='response-headers-container'>
                                                <div className='response-headers-content'>
                                                    <div className='response-headers-table'>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Key</th>
                                                                    <th>Value</th>
                                                                    <th>Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tab.headers && tab.headers.map((header, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            {/* <input type='checkbox' checked></input> */}
                                                                        </td>
                                                                        <td><input placeholder={header.keyPlaceholder} value={header.key} onChange={(e) => handleHeaderInput(tab.id, index, { ...header, key: e.target.value })}></input></td>
                                                                        <td><input placeholder={header.valuePlaceholder} value={header.value} onChange={(e) => handleHeaderInput(tab.id, index, { ...header, value: e.target.value })}></input></td>
                                                                        <td><input placeholder={header.descriptionPlaceholder} value={header.description} onChange={(e) => handleHeaderInput(tab.id, index, { ...header, description: e.target.value })}></input></td>
                                                                    </tr>))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                }

                            </>))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServerComponent;