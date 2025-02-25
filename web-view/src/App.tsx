import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/about.component';
import Sidebar from './components/sidebar.component';
import './App.scss';
import Home from './components/home.component';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;