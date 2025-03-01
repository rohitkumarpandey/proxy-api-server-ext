import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarComponent from './components/sidebar.component';
import './App.scss';
import ServerComponent from './components/server.component';
import { Api, Collection } from './model/collection.model';
import CollectionComponent from './components/collection.component';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 'collection-1',
      name: 'New Collection',
      description: 'de',
      api: [{
        id: 'api-1',
        method: 'GET',
        name: 'hey',
        url: 'http://localhost:5256/user',
        endpoint: '',
        islive: true
      }
      ]
    },
    {
      id: 'collection-1',
      name: 'New Collection',
      description: 'Collec',
      api: [{
        id: 'api-2',
        method: 'GET',
        name: 'http://localhost:5256/user',
        url: 'http://localhost:5256/user',
        endpoint: '/user',
        islive: false
      },
      {
        id: 'api-3',
        method: 'POST',
        name: 'http://localhost:5256/user',
        url: 'http://localhost:5256/user',
        endpoint: '/user',
        islive: true
      }]
    }
  ]);

  const addCollectionBtnHandler = (collection: Collection) => {
    setCollections([...collections, collection]);
    navigate('/collection', { state: { collections } });
  }

  const serverHandler = (api: Api) => {
    navigate('/server', { state: { api } });
  }

  return (
    <div className="App">
      <div className='pas-container'>
        <div className="pas-sidebar">
          <SidebarComponent
            collections={collections}
            addCollectionBtnHandler={addCollectionBtnHandler}
            serverHandler={serverHandler} />
        </div>
        <div className='pas-content'>
          <Routes>
            <Route path="/server" element={<ServerComponent />} />
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