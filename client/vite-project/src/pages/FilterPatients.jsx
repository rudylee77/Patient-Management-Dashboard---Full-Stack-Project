import React from 'react';
import PatientDatabase from "../components/PatientDatabase";
import '../styles/add.css';

const AddPatients = () => {
  return (
    <div className='dashboard-container'>
        <div className='title'>Filter</div>
        <PatientDatabase />
    </div>
    
  );
};

export default AddPatients;
