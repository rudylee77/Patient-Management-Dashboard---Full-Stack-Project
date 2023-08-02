import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import PatientDatabase from '../components/PatientDatabase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    // Fetch the list of patients from the JSON server
    fetch('http://localhost:4000/patients')
      .then((response) => response.json())
      .then((data) => {
        setInitialData(data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  return (
    <div className='dashboard-container'>
      <div className='title'>Welcome to the Patient Management Dashboard</div>
      <Link to='/filter' className='filter-add-button'>
        Filter
      </Link>
      <Link to='/add' className='filter-add-button'>
        Add Patient
      </Link>
      <PatientDatabase data={initialData} filters={[]} />
    </div>
  );
};

export default Dashboard;
