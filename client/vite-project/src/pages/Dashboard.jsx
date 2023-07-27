import React from 'react';
import '../styles/dashboard.css';
import PatientDatabase from "../components/PatientDatabase";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
      <div className='title'>Welcome to the Patient Management Dashboard</div>
      <Link to="/filter" className="filter-add-button">Filter</Link>
      <Link to="/add" className="filter-add-button">Add Patient</Link>
        <PatientDatabase />
    </div>
  );
};

export default Dashboard;