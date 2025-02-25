import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/about.component';
import Sidebar from './components/sidebar.component';
import './App.scss';
import Server from './components/server.component';

function App() {
  return (
    <Router>
      <div className="App">
        <div className='pas-container'>
          <div className="pas-sidebar">
            <Sidebar />
          </div>
          <div className='pas-content'>
            <Routes>
              <Route path="/" element={<Server />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
        </div>
    </Router>
  );
}

export default App;