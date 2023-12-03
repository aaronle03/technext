import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Graph from './components/Graph';

function App() {
  return (
    <Router>
      <div className="Main">
        <Navbar />
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/" element={<Home />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
