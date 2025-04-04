import React from 'react';
import { Api, Collection } from '../model/collection.model';
import AppUtil from '../common/app.util';

interface SidebarProps {
  collections: Collection[];
  addCollectionBtnHandler: (collection: Collection) => void;
  addNewApiBtnHandler: (collectionId: string) => void;
  serverHandler: (collectiondId: string, api: Api) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ collections, addCollectionBtnHandler, serverHandler, addNewApiBtnHandler }) => {


  function addNewCollection(handler: (collection: Collection) => void) {
    handler(AppUtil.getNewCollection());
  }
  function collapseCollections(collectionContainerId: string) {
    const collectionContainer = document.getElementById(collectionContainerId);
    if (collectionContainer) {
      const isCollapsed = collectionContainer.classList.contains('collapsed');
        collectionContainer.classList[isCollapsed ? 'remove' : 'add']('collapsed');
        collectionContainer.classList[isCollapsed ? 'add' : 'remove']('expanded');
    }
  }
  return (
    <div className="sidebar">
      <div className="collection">
        <div>Collections</div>
        <div className='collection-add-btn' onClick={() => addNewCollection(addCollectionBtnHandler)}>+</div>
      </div>
      <div className="accordion">
        {collections.map((collection, index) => (
          <div key={index} className="accordion-item">
            <h2 className="accordion-header" id={`heading${index}`}>
              <div
                id={`accordion-btn-${index}`}
                className="accordion-button collapsed"
              >
                <span className="accordion-icon accordion-expand-btn" data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                  onClick={() => collapseCollections(`accordion-btn-${index}`)}></span>
                {collection.name}
                <div className='collection-api-options'>
                  <div className='accordion-icon' onClick={() => addNewApiBtnHandler(collection.id)}>+</div>
                </div>
              </div>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
            >
              {collection.api.map((api) => (
                <div className="accordion-body" onClick={() => serverHandler(collection.id, api)} key={api.id}>
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