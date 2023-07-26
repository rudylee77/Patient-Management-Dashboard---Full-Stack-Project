import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterForm from './components/RegisterForm';
import './App.css'

function App() {
  return ( 
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
    )
 
}

export default App;
