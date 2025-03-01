import React from 'react';
import { Api, Collection } from '../model/collection.model';
import AppUtil from '../common/app.util';

interface SidebarProps {
  collections: Collection[];
  addCollectionBtnHandler: (collection: Collection) => void;
  serverHandler: (api: Api) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ collections, addCollectionBtnHandler, serverHandler }) => {

  function addNewCollection(handler: (collection: Collection) => void) {
    handler(AppUtil.getNewCollection());
  }
  
  return (
    <div className="sidebar">
      <div className="collection">
        <div>Collections</div>
        <div className='collection-add-btn' onClick={() => addNewCollection(addCollectionBtnHandler)}>+</div>
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