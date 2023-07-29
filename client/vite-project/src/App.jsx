import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Register from './pages/RegisterPage';
import Filter from './pages/FilterPatients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import './App.css'

function App() {
  return ( 
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/add" element={<AddPatient />} />
          <Route path="/edit" element={<EditPatient />} />
        </Routes>
    </Router>
    )
 
}

export default App;