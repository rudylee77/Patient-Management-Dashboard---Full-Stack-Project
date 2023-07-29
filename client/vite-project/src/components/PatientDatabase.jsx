import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

const PatientDatabase = ({ selectedField, filterValue }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch the list of patients from the JSON server
    fetch('http://localhost:4000/patients')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  // Filter the patients based on the selected field and filter value
  const filteredPatients = patients.filter((patient) => {
    const fieldValue = patient[selectedField];
    if (typeof fieldValue === 'string') {
      // Case-insensitive string matching for strings
      return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
    } else {
      // Direct comparison for non-string fields
      return fieldValue === filterValue;
    }
  });

  return (
    <div className='patient-database-container'>
      <table className='database'>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Date of Birth</th>
            <th>Status</th>
            <th>Address</th>
            {patients.length > 0 && patients[0].additionalFields && patients[0].additionalFields.map((field, index) => (
              <th key={index}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.firstName + ' ' + patient.middleName + ' ' + patient.lastName}</td>
              <td>{patient.dateOfBirth}</td>
              <td>{patient.status}</td>
              <td>{patient.address.street + ' ' + patient.address.city + ', ' + patient.address.state + ' ' + patient.address.zipCode}</td>
              {patient.additionalFields && patient.additionalFields.map((field, index) => (
                <td key={index}>{field.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDatabase;
