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
import { LoadingService } from './service/loading.service';
import LoadingComponent from './components/loading.component';
import { SubscriberService } from './service/subscriber.service';
import { MessageType } from './common/message-type';

function App() {
  const [serverLive, setServerLive] = useState<boolean>(false);
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([
    AppUtil.getNewCollection()
  ]);
  const location = useLocation();
  if (location.pathname === '/index.html') {
    navigate('/');
  }
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { command, data } = event.data;

      if (command === 'loadWebViewState') {
        if (data && data.collections) {
          setCollections(data.collections);
        }
      }
      if (command === 'serverStarting') {
        LoadingService.show();
        SubscriberService.notifyApplicationStatus(MessageType.APP_STARTING);
      }
      if (command === 'serverStarted') {
        SubscriberService.notifyApplicationStatus(MessageType.APP_LIVE);
        setServerLive(true);
        LoadingService.hide();
      }
      if (command === 'serverRestarting') {
        SubscriberService.notifyApplicationStatus(MessageType.APP_RESTARTING);
      }
      if (command === 'serverStopped') {
        SubscriberService.notifyApplicationStatus(MessageType.APP_STOPPED);
        ExtensionService.saveWebViewState({ collections: collections });
        setServerLive(false);
        LoadingService.hide();
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const updateCollections = (collections: Collection[]) => {
    LoadingService.show();
    setCollections(collections);
    ExtensionService.saveWebViewState({ collections: collections });
    LoadingService.hide();
  }
  const addCollectionBtnHandler = (collection: Collection) => {
    updateCollections([...collections, collection]);
    navigate('/collection', { state: { collection } });
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
    LoadingService.show();
    const appState: State = prepareApiState(collections);
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
  const collectionViewer = (collection: Collection) => {
    navigate('/collection', { state: { collection } });
  }

  const updateCollection = (collection: Collection) => {
    const updatedCollections = collections.map(c => c.id === collection.id ? collection : c);
    updateCollections(updatedCollections);
  }
  const deleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter(collection => collection.id !== collectionId);
    updateCollections(updatedCollections);
    if (serverLive) {
      startLiveServer(updatedCollections);
    }
    navigate('/');
  }
  const deleteApiHandler = (collectionId: string, apiId: string) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        const updatedApi = collection.api.filter(api => api.id !== apiId);
        return { ...collection, api: updatedApi };
      }
      return collection;
    });
    updateCollections(updatedCollections);
    if (serverLive) {
      startLiveServer(updatedCollections);
    }
    navigate('/');
  }
  return (
    <>
      <LoadingComponent />
      <div className="App">
        <div className='pas-container'>
          <div className="pas-sidebar">
            <SidebarComponent
              collections={collections}
              addCollectionBtnHandler={addCollectionBtnHandler}
              collectionViewer={collectionViewer}
              serverHandler={serverHandler}
              addNewApiBtnHandler={addNewApiBtnHandler}
              onApiDelete={deleteApiHandler} />
          </div>
          <div className='pas-content'>
            <Routes>
              <Route path="/" element={<LandingPageComponent />} />
              <Route path="/server" element={<ServerComponent apiServerHandler={apiServerHandler} apiChangeHandler={apiChangeHandler} />} />
              <Route path="/collection" element={<CollectionComponent onCollectionUpdate={updateCollection} onCollectionDelete={deleteCollection} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}