import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const PatientDatabase = ({ data, filters }) => {
  const navigate = useNavigate();

  // Mapping between field names and their display labels
  const fieldLabels = {
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    status: 'Status',
    address: 'Address',
  };

  // Filter the patients based on the selected filters
  const filteredPatients = data.filter((patient) => {
    return filters.every((filter) => {
      const { selectedField, filterValue } = filter;
      if (selectedField && filterValue) {
        const fieldValue = patient[selectedField];
        if (selectedField === 'firstName') {
          // For firstName, perform case-insensitive filtering on the firstName property only
          return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (selectedField === 'address') {
          // For address, perform case-insensitive filtering on the full address string
          const addressString = `${patient.address.street} ${patient.address.city} ${patient.address.state} ${patient.address.zipCode}`;
          return addressString.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof fieldValue === 'string') {
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
  
  // Function to handle row click and navigate to EditPatient page with patient data
  const handleRowClick = (patient) => {
    navigate('/edit', { state: { patientData: patient } });
  };

  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });

  const handleHeaderClick = (key) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === key) {
        return { ...prevSortConfig, direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortConfig.key === 'address') {
      const aValue = a.address.street; // Sort by address.street
      const bValue = b.address.street;
  
      // Compare the address strings directly
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (sortConfig.key === 'dateOfBirth') {
      const aDate = new Date(a[sortConfig.key]);
      const bDate = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    } else if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
      return sortConfig.direction === 'asc' ? a[sortConfig.key].localeCompare(b[sortConfig.key]) : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    }
  
    return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
  });
  
  const getFullName = (patient) => {
    let fullName = patient.firstName;
    if (patient.middleName) {
      fullName += ' ' + patient.middleName;
    }
    if (patient.lastName) {
      fullName += ' ' + patient.lastName;
    }
    return fullName;
  };

  return (
    <div className='patient-database-container'>
      <table className='database'>
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick('firstName')}>
              Full Name {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleHeaderClick('dateOfBirth')}>
              Date of Birth {sortConfig.key === 'dateOfBirth' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleHeaderClick('status')}>
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleHeaderClick('address')}>
              Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            {data.length > 0 &&
              data[0].additionalFields &&
              data[0].additionalFields.map((field, index) => (
                <th key={index} onClick={() => handleHeaderClick(`additionalFields[${index}].value`)}>
                  {field.label} {sortConfig.key === `additionalFields[${index}].value` && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {sortedPatients.map((patient) => (
              <tr key={patient.id} onClick={() => handleRowClick(patient)}>
              <td>{getFullName(patient)}</td>
              <td>{patient.dateOfBirth}</td>
              <td>{patient.status}</td>
              <td>
                {patient.address.street +
                  ' ' +
                  patient.address.city +
                  ', ' +
                  patient.address.state +
                  ' ' +
                  patient.address.zipCode}
              </td>
              {patient.additionalFields &&
                patient.additionalFields.map((field, index) => (
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
