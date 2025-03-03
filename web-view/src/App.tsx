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

function App() {
  const location = useLocation();
  const [displayLandingPage, setLandingPageVisibility] = useState<boolean>(true);
  useEffect(() => {
    if(location.pathname === '' || location.pathname === '/' || location.pathname === '/index.html') {
      setLandingPageVisibility(true);
    } else {
      setLandingPageVisibility(false);
    };
  }, [location]);
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([
    AppUtil.getNewCollection()
  ]);

  const addCollectionBtnHandler = (collection: Collection) => {
    setCollections([...collections, collection]);
    setLandingPageVisibility(false);
    navigate('/collection', { state: { collections } });
  }

  const serverHandler = (api: Api) => {
    setLandingPageVisibility(false);
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
          { displayLandingPage &&
            <LandingPageComponent/>
          }
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