import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SidebarComponent from './components/sidebar.component';
import './App.scss';
import ServerComponent from './components/server.component';
import { Api, Collection } from './model/collection.model';
import CollectionComponent from './components/collection.component';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppUtil from './common/app.util';
import LandingPageComponent from './components/landing-page.component';
import { State, StateApi, StateApiDetails, StateApiHeaderDetails, StateApiResponseBodyDetails, StateApiResponseDetails, StateCollection } from './model/api-server.model';
import { ExtensionService } from './service/extension.service';

function App() {
  const location = useLocation();
  const [displayLandingPage, setLandingPageVisibility] = useState<boolean>(true);
  useEffect(() => {
    if (location.pathname === '' || location.pathname === '/' || location.pathname === '/index.html') {
      setLandingPageVisibility(true);
    } else {
      setLandingPageVisibility(false);
    };
  }, [location]);
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([
    AppUtil.getNewCollection()
  ]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { command, data } = event.data;

      if (command === 'loadWebViewState') {
        if (data && data.collections) {
          setCollections(data.collections);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const updateCollections = (collections: Collection[]) => {
    setCollections(collections);
    ExtensionService.saveWebViewState({ collections: collections });
  }
  const addCollectionBtnHandler = (collection: Collection) => {
    updateCollections([...collections, collection]);
    setLandingPageVisibility(false);
    navigate('/collection', { state: { collections } });
  }
  const addNewApiBtnHandler = (collectionId: string) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        collection.api.push(AppUtil.getNewApi());
      }
      return collection;
    });
    updateCollections(updatedCollections);
  }

  const serverHandler = (collectionId: string, api: Api) => {
    setLandingPageVisibility(false);
    navigate('/server', { state: { collectionId: collectionId, api: api } });
  }

  const apiServerHandler = (collectionId: string, api: Api): void => {
    const updatedCollections = apiChangeHandler(collectionId, api);
    startLiveServer(updatedCollections);
  }
  
  const apiChangeHandler = (collectionId: string, updatedApi: Api): Collection[] => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          api: collection.api.map(a => a.id === updatedApi.id ? updatedApi : a)
        };
      }
      return collection;
    });
    updateCollections(updatedCollections);
    return updatedCollections;
  }

  const startLiveServer = (collections: Collection[]): void => {
    const appState: State = prepareApiState(collections);
    console.log('App state:', appState);
    ExtensionService.saveStateAndStartServer(appState);
  }

  function prepareApiState(collections: Collection[]): State {
    const appState: State = { collections: [] };
    collections.forEach(collection => {
      let stateCollection: StateCollection = { id: collection.id, name: collection.name, apis: [] };
      collection.api.forEach(api => {
        if (api.islive) {
          const stateApiResponseBodyDetails: StateApiResponseBodyDetails = {
            content: api.response?.responseBody.content,
            type: api.response?.responseBody.contentType
          }
          const headers: StateApiHeaderDetails[] = [];
          api.response?.headers && api.response?.headers.forEach(header => headers.push({ name: header.key, value: header.value }));
          const stateApiResponseDetails: StateApiResponseDetails = { body: stateApiResponseBodyDetails, headers: headers };
          const stateApiDetails: StateApiDetails = {
            method: api.method,
            endpoint: api.endpoint,
            responseCode: api.response?.httpStatus.code,
            response: stateApiResponseDetails,
            latency: api.latency
          }
          const stateApi: StateApi = { apiId: api.id, isLive: api.islive, apiName: api.name, apiDetails: stateApiDetails };
          stateCollection.apis.push(stateApi);
        }
      });

      if (stateCollection.apis.length) {
        appState.collections.push(stateCollection);
      }
    });
    return appState;
  }

  return (
    <div className="App">
      <div className='pas-container'>
        <div className="pas-sidebar">
          <SidebarComponent
            collections={collections}
            addCollectionBtnHandler={addCollectionBtnHandler}
            serverHandler={serverHandler}
            addNewApiBtnHandler={addNewApiBtnHandler} />
        </div>
        <div className='pas-content'>
          {displayLandingPage &&
            <LandingPageComponent />
          }
          <Routes>
            <Route path="/server" element={<ServerComponent apiServerHandler={apiServerHandler} apiChangeHandler={apiChangeHandler} />} />
            <Route path="/collection" element={<CollectionComponent />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}