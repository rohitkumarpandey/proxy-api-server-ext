import React, { useState } from 'react';
import Button from './button.component';
import { useLocation } from 'react-router-dom';
import { Api } from '../model/collection.model';
import AppUtil from '../common/app.util';
const ServerComponent: React.FC = () => {
    const location = useLocation();
    const stateApi = location.state?.api as Api;

    const [api, updateApi] = useState<Api>(stateApi);
    const defaultActiveTab: string = api.responseTabs[0].id;
    const [activeTab, setResponseTab] = useState<string>(defaultActiveTab);
    const defaultActiveResponseContent: string = `response-body-${defaultActiveTab}`;
    const [activeResponseContent, setResponseContent] = useState<string>(defaultActiveResponseContent);

    function renderResponseTab(tabId: string) {
        setResponseTab(tabId);
        renderResponseContent(`response-body-${tabId}`)
    }

    function renderResponseContent(contentId: string) {
        setResponseContent(contentId);
    }

    function addNewResponseTab(): void {
        const newTab = AppUtil.getNewResponseTab();
        const updatedApi = { ...api, responseTabs: [...api.responseTabs, newTab] };
        updateApi(updatedApi);
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

                        {/* {false && <div className='server-request-validator'>
                            <div className='server-request-validator-options'>
                                <div className='server-request-validator-option' data-bs-target="#request-auth" onClick={() => renderRequestValidator('auth')}>Authorization</div>
                                <div className='server-request-validator-option' data-bs-target="#request-headers" onClick={() => renderRequestValidator('headers')}>Headers</div>
                                <div className='server-request-validator-option' data-bs-target="#request-body" onClick={() => renderRequestValidator('body')}>
                                    Body
                                </div>
                            </div>
                            <div className='server-request-validator-container'>
                                <div id="request-auth" className={`server-request-validator-auth show ${validator == 'auth' ? '' : 'd-none'}`}>
                                    <div>
                                        Auth Type: &nbsp;
                                        <select>
                                            {AppUtil.getAuthTypes().map(auth => (
                                                <option value={auth.id}>{auth.name}</option>
                                            ))}
                                        </select>
                                        &nbsp; or else return &nbsp;
                                        <select>
                                            {AppUtil.getAuthTypes().map(auth => (
                                                <option value={auth.id}>{auth.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div id="request-headers" className={`${validator == 'headers' ? 'show' : 'd-none'}`}>headers</div>
                                <div id="request-body" className={`${validator == 'body' ? 'show' : 'd-none'}`}>Body</div>
                            </div>

                        </div>
                        } */}
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
                                                        <li className='radio-ehecked'>
                                                            <input type="radio" name="response-data-type" id="response-data-type-none"
                                                                value="none" ></input>
                                                            <label htmlFor="response-data-type-none">None</label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" name="response-data-type" id="response-data-type-string"
                                                                value="string"></input>
                                                            <label htmlFor="response-data-type-string">String</label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" name="response-data-type" id="response-data-type-json"
                                                                value="json"></input>
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
                                                    Beautify
                                                </div>
                                            </div>
                                            <div className='response-body-content' contentEditable='true'>
                                                Response
                                            </div>
                                        </div>
                                        <div id={`headers-${tab.id}`} className={`${activeResponseContent == `response-headers-${tab.id}` ? '' : 'd-none'}`}>
                                            Headers
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