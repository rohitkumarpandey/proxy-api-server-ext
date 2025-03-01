import React, { useState } from 'react';
import Button from './button.component';
import { useLocation } from 'react-router-dom';
import { Api } from '../model/collection.model';
import AppUtil from '../common/app.util';
const ServerComponent: React.FC = () => {
    const location = useLocation();
    const api = location.state?.api as Api;

    const [validator, setValidator] = useState<string>('auth');

    function renderRequestValidator(validator: string): void {
        setValidator(validator)
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

                        <div className='server-request-validator'>
                            <div className='server-request-validator-options'>
                                <div className='server-request-validator-option' data-bs-target="#request-auth" onClick={() => renderRequestValidator('auth')}>Authorization</div>
                                <div className='server-request-validator-option' data-bs-target="#request-headers" onClick={() => renderRequestValidator('headers')}>Headers</div>
                                <div className='server-request-validator-option' data-bs-target="#request-body" onClick={() => renderRequestValidator('body')}>
                                    Body
                                </div>
                            </div>
                            <div className='server-request-validator-container'>
                                <div id="request-auth" className={`show ${validator == 'auth' ? '' : 'd-none'}`}>
                                    <div>
                                        Auth Type:
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
                    </div>
                    <div className='server-response-container'>
                        <div className='server-response-status'>
                            <ul>
                                <li className='radio-ehecked'>
                                    <input type="radio" name="response-status" id="response-status-200"
                                        value="200"></input>
                                    <label htmlFor="response-status-200">200</label>
                                </li>
                                <li>
                                    <input type="radio" name="response-status" id="response-status-400"
                                        value="400"></input>
                                    <label htmlFor="response-status-400">400</label>
                                </li>
                                <li>
                                    <input type="radio" name="response-status" id="response-status-500"
                                        value="500"></input>
                                    <label htmlFor="response-status-500">500</label>
                                </li>
                            </ul>
                        </div>
                        <div className='response-type-tab-container'>
                            <div className='response-type-tab'>
                                <div className="tab-label">200 Success</div>
                                <div className="close-tab">+</div>
                            </div>
                            <div className="new-response-type-tab-btn">+</div>
                        </div>
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
                            <div className='response-data-type-formatter'>
                                Beautify
                            </div>
                        </div>
                        <div className='response-body-config'>
                            <div className='response-body-tab'>Body</div>
                            <div className='response-body-header'>Headers</div>
                        </div>
                        <div className='response-body-content'
                            contentEditable="true">respone</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServerComponent;