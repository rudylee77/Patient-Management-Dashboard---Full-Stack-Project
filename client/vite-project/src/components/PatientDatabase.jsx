import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

const PatientDatabase = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/patients')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  return (
    <div className='patient-database-container'>
      <table className='database'>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Date of Birth</th>
            <th>Status</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.firstName + ' ' + patient.middleName + ' ' + patient.lastName}</td>
              <td>{patient.dateOfBirth}</td>
              <td>{patient.status}</td>
              <td>{patient.address.street + ' ' + patient.address.city + ', ' + patient.address.state + ' ' + patient.address.zipCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDatabase;
