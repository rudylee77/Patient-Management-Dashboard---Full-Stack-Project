import React from 'react';
import PatientForm from "../components/PatientForm";
import '../styles/add.css';

const AddPatients = () => {
  return (
    <div className='dashboard-container'>
        <div className='title'>Add Patient</div>
        <PatientForm />
    </div>
    
  );
};

export default AddPatients;
