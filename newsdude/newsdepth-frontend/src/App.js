import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:headlineIndex" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;