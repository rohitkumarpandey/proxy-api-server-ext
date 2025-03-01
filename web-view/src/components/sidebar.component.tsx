import React from 'react';
import {Api, Collection} from '../model/collection.model';

interface SidebarProps {
  collections: Collection[];
  addCollectionBtnHandler: () => void;
  serverHandler:(api: Api) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ collections, addCollectionBtnHandler, serverHandler }) => {
  return (
    <div className="sidebar">
      <div className="collection">
        <div>Collections</div>
        <div className='collection-add-btn' onClick={addCollectionBtnHandler}>+</div>
      </div>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        {collections.map((collection, index) => (
          <div key={index} className="accordion-item">
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                {collection.name}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
            >
              {collection.api.map((api) => (
                <div className="accordion-body" onClick={() => serverHandler(api)} key={api.id}>
                  <div className='api-container'>
                    <div className={`api-live-container ${api.islive ? 'api-live' : ''}`}>
                      <div></div>
                    </div>
                    <strong className={`api-method api-method-${api.method.toLowerCase()}`}>{api.method}
                    </strong>&nbsp;<div className='api-url'>{api.name || api.url}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarComponent;