import React, { useState } from 'react';
import PatientForm from '../components/PatientForm';
import '../styles/add.css';

const AddPatients = () => {
  const [initialConfigFormFields, setInitialConfigFormFields] = useState(null);

  return (
    <div className='dashboard-container'>
      <div className='title'>Add Patient</div>
      <PatientForm initialConfigFormFields={initialConfigFormFields} />
    </div>
  );
};

export default AddPatients;
