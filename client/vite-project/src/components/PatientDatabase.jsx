import React from 'react';
import '../styles/dashboard.css';

const PatientDatabase = ({ data, filters }) => {
  // Mapping between field names and their display labels
  const fieldLabels = {
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    status: 'Status',
    address: 'Address',
    // Add more fields if needed
  };

  // Filter the patients based on the selected filters
  const filteredPatients = data.filter((patient) => {
    return filters.every((filter) => {
      const { selectedField, filterValue } = filter;
      if (selectedField && filterValue) {
        const fieldValue = patient[selectedField];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (Array.isArray(fieldValue)) {
          return fieldValue.includes(filterValue);
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
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
            {data.length > 0 && data[0].additionalFields && data[0].additionalFields.map((field, index) => (
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
