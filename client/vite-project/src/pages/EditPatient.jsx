import React from 'react';
import { useLocation } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import '../styles/add.css';

const EditPatient = () => {
  const location = useLocation();
  const { patientData } = location.state;

  return (
    <div>
      <div className='title'>Edit Patient</div>
      <PatientForm patientData={patientData} />
    </div>
  );
};

export default EditPatient;