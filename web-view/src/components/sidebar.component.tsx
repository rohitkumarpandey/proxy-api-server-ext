import React from 'react';
import { Api, Collection } from '../model/collection.model';
import AppUtil from '../common/app.util';
import { CONSTANT } from '../common/constant';

interface SidebarProps {
  collections: Collection[];
  addCollectionBtnHandler: (collection: Collection) => void;
  addNewApiBtnHandler: (collectionId: string) => void;
  collectionViewer: (collection: Collection) => void;
  serverHandler: (collection: string, api: Api) => void;
  onApiDelete: (collectionId: string, apiId: string) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ collections, addCollectionBtnHandler, collectionViewer, serverHandler, addNewApiBtnHandler, onApiDelete }) => {


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
  function apiSelection(apiContainerId: string) {
    const apiContainer = document.getElementById(apiContainerId);
    // remove the active class from all api containers
    const allApiContainers = document.querySelectorAll('.api-method-container');
    allApiContainers.forEach((container) => {
      container.classList.remove('active-api');
    });
    // add the active class to the selected api container
    if (apiContainer) {
      apiContainer.classList['add']('active-api');
    }
  }
  function clearApiSelection() {
    const allApiContainers = document.querySelectorAll('.api-method-container');
    allApiContainers.forEach((container) => {
      container.classList.remove('active-api');
    }
    );
  }
  return (
    <div className="sidebar">
      <div className="collection">
        <div>Collections</div>
        <div className='collection-add-btn' onClick={() => addNewCollection(addCollectionBtnHandler)}>+</div>
      </div>
      <div className="collections-container">
        {collections.map((collection, index) => (
          <div key={index} className="accordion-item">
            <h2 className="accordion-header" id={`heading${index}`}>
              <div
                id={`accordion-btn-${index}`}
                className="accordion-button collapsed"
                onClick={() => {
                  clearApiSelection()
                  collectionViewer(collection)
                }}
              >
                <span id={`accordion-item-${collection.id}`} className="accordion-icon accordion-expand-btn" data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    collapseCollections(`accordion-btn-${index}`)
                  }
                  }></span>
                {collection.name}
                <div className='collection-api-options'>
                  <div className='accordion-icon' onClick={(e) => {
                    e.stopPropagation();
                    addNewApiBtnHandler(collection.id)
                  }
                  }>+</div>
                </div>
              </div>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
            >
              {collection.api.map((api) => (
                <div className="accordion-body" onClick={() => {
                  apiSelection(`api-container-${api.id}`);
                  serverHandler(collection.id, api)
                }} key={api.id}>
                  <div className='api-container'>
                    <div className={`api-live-container ${api.islive ? 'api-live' : ''}`}>
                      <div></div>
                    </div>
                    <div id={`api-container-${api.id}`} className='d-flex api-method-container'>
                      <div>
                        <strong className={`api-method api-method-${api.method.toLowerCase()}`}>
                          {api.method.toUpperCase()}
                        </strong>
                      </div>
                      <div className='api-url'>{api.name || CONSTANT.DEFAULT.API.NAME}</div>
                      <div key={`api-delete-${api.id}`} className='api-options'>
                        <div className='api-delete' onClick={(e) => {
                          e.stopPropagation();
                          onApiDelete(collection.id, api.id)
                        }}>Remove</div>
                      </div>
                    </div>
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