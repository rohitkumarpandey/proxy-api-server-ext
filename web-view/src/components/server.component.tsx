import React, { useState, useRef } from 'react';
import Button from './button.component';
import { useLocation } from 'react-router-dom';
import { Api, ApiResponseTab, ResponseHeader } from '../model/collection.model';
import AppUtil from '../common/app.util';
import JsonEditor from './json-editor.component';

const ServerComponent: React.FC = () => {
    const location = useLocation();
    const stateApi = location.state?.api as Api;

    const [api, updateApi] = useState<Api>(stateApi);
    const defaultActiveTab: string = api.responseTabs[0].id;
    const [activeTab, setResponseTab] = useState<string>(defaultActiveTab);
    const defaultActiveResponseContent: string = `response-body-${defaultActiveTab}`;
    const [activeResponseContent, setResponseContent] = useState<string>(defaultActiveResponseContent);
    const [isInvalidJSON, setInvalidJSON] = useState<boolean>(false);

    const jsonEditorRef = useRef<{ formatJson: () => boolean }>(null);

    function renderResponseTab(tabId: string) {
        setResponseTab(tabId);
        renderResponseContent(`response-body-${tabId}`)
    }

    function renderResponseContent(contentId: string) {
        setResponseContent(contentId);
    }

    function addNewResponseTab(): void {
        const newTab = AppUtil.getNewResponseTab();
        api.responseTabs.push(newTab);
        updateApi(api);
        renderResponseTab(newTab.id);
    }

    function removeResponeTab(tabId: string) {
        const filteredApi = api.responseTabs.filter(tab => tab.id != tabId);
        const updatedApi = { ...api, responseTabs: [...filteredApi] };
        updateApi(updatedApi);
        const lastResponseTabId = updatedApi.responseTabs.slice(-1).at(0)?.id;
        if (lastResponseTabId) {
            renderResponseTab(lastResponseTabId);
        }
    }

    function handleHeaderInput(tabId: string, headerIndex: number, updatedheader: ResponseHeader): void {
        const updatedTabs: ApiResponseTab[] = api.responseTabs.map(tab => {
            if (tab.id === tabId) {
                const headersSize: number = tab.headers.length;
                const updatedHeaders = tab.headers.map((header, index) => {
                    if (index === headerIndex) {
                        return { ...header, updatedheader };
                    }
                    return header;
                });
                if (headersSize === headerIndex + 1) {
                    updatedHeaders.push(AppUtil.getNewHeader());
                }
                return { ...tab, headers: updatedHeaders };
            }
            return tab;
        });
        updateApi({ ...api, responseTabs: updatedTabs });
    }

    function handleResponseInput(tabId: string, value: string, contentType: 'string' | 'json' | 'none' = 'json'): void {
        let formattedValue = value;
        if (contentType === 'json') {
            try {
                const jsonObject = JSON.parse(value);
                formattedValue = JSON.stringify(jsonObject, null, 2);
            } catch (error) {
                formattedValue = value;
            }
        }

        const updatedTabs: ApiResponseTab[] = api.responseTabs.map(tab => {
            if (tab.id === tabId) {
                tab.responseBody = {
                    contentType: contentType,
                    content: formattedValue
                }
            }
            return tab;
        });
        updateApi({ ...api, responseTabs: updatedTabs });
    }

    const handleBeautifyClick = () => {
        if (jsonEditorRef.current) {
            const isFormatted: boolean = jsonEditorRef.current.formatJson();
            console.log('is invalid json', isFormatted)
            if (!isFormatted) {
                setInvalidJSON(true);
            } else {
                setInvalidJSON(false);
            }
        }
    };

    return (
        <>
            <div className="server-container">
                <div className='server-form-container'>
                    <div className='server-request-config-container'>
                        <div className='server-breadcrumb'>
                            New Collection / {api.name}
                        </div>
                        <div className="server-url-container">
                            <select name="server-request-type" id="server-request-type" className="server-request-type-select"
                                defaultValue="get">
                                <option className="request-type-get" value="get">GET</option>
                                <option className="request-type-post" value="post">POST</option>
                                <option className="request-type-put" value="put">PUT</option>
                                <option className="request-type-post" value="patch">PATCH</option>
                                <option className="request-type-delete" value="delete">DELETE</option>
                            </select>
                            <input type="text" className="server-url-domain" value="http://localhost" disabled></input>
                            <input type="text" className="server-url-port" value="5256" disabled></input>
                            <input id="pas-url-endpoint" name="server-url-endpoint" type="text" className="server-url-endpoint"
                                value={api.endpoint} placeholder="Enter the endpoint starting with /"></input>
                            <div className="live-server-button">
                                <Button label='Live' type='secondary' handler={() => { }} />
                            </div>
                        </div>
                    </div>
                    <div className='server-response-container'>
                        <div className='server-response-status'>
                            <div className='d-flex align-items-center'>
                                API Response:
                                <select>
                                    {api.responseTabs.map(tab => (
                                        <option value={tab.id}>{tab.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='server-response-latency'>
                                Latency:
                                <select>
                                    {AppUtil.getLatency().map(latency => (
                                        <option value={latency.value}>{latency.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='response-type-tab-container'>
                            <div className='d-flex'>
                                {api.responseTabs && api?.responseTabs.map(tab => (
                                    <div className={`response-type-tab ${activeTab === tab.id ? 'active-tab' : ''}`}>
                                        <div className="tab-label"
                                            onClick={() => renderResponseTab(tab.id)}
                                        >{`${tab.httpStatus.code} ${tab.httpStatus.status}`}</div>
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
                                        <input value={tab.name}></input>
                                    </div>
                                    <div id={`#response-${tab.httpStatus.code}-${tab.httpStatus.status}`} className={`response-body-config`}>
                                        <div className={`${activeResponseContent == `response-body-${tab.id}` ? 'active-content-tab' : ''}`} onClick={() => renderResponseContent(`response-body-${tab.id}`)}>Body</div>
                                        <div className={`${activeResponseContent == `response-headers-${tab.id}` ? 'active-content-tab' : ''}`} onClick={() => renderResponseContent(`response-headers-${tab.id}`)}>Headers</div>
                                    </div>
                                    <div className='response-body'>
                                        <div id={`body-${tab.id}`} className={`${activeResponseContent == `response-body-${tab.id}` ? 'h-100' : 'd-none'}`}>
                                            <div className='response-data-type-config'>
                                                <div className='response-data-type'>
                                                    <ul>
                                                        <li>
                                                            <input type="radio" name="response-data-type" id="response-data-type-none"
                                                                value="none" checked={tab.responseBody.contentType === 'none'}></input>
                                                            <label htmlFor="response-data-type-none">None</label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" name="response-data-type" id="response-data-type-string"
                                                                value="string" checked={tab.responseBody.contentType === 'string'}></input>
                                                            <label htmlFor="response-data-type-string">String</label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" name="response-data-type" id="response-data-type-json"
                                                                value="json" checked={tab.responseBody.contentType === 'json'}></input>
                                                            <label htmlFor="response-data-type-json">JSON</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className='response-status-select d-flex align-items-center'>
                                                    Response Status:
                                                    <select>
                                                        {AppUtil.getHttpRequests().map(req => (
                                                            <option value={req.code}>{`${req.code} ${req.status}`}</option>
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
                                                <div className={`invalid-json ${isInvalidJSON ? '': 'd-none'}`}>Invalid Json</div>
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
                                                                {tab.headers.map((header, index) => (
                                                                    <tr key={index}>
                                                                        <td></td>
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