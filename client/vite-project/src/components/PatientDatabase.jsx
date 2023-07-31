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

  const getAdditionalFieldValueByLabel = (patient, label) => {
    const additionalField = patient.additionalFields.find((field) => field.label === label);
    return additionalField ? additionalField.value : '';
  };

  const filteredPatients = data.filter((patient) => {
    return filters.every((filter) => {
      const { selectedField, filterValue } = filter;
  
      if (selectedField && filterValue) {
        if (selectedField in fieldLabels) {
          var fieldValue =  patient[selectedField];   
          if (selectedField === 'firstName') {
            // For firstName, perform case-insensitive filtering on the firstName property only
            return fieldValue.toLowerCase().startsWith(filterValue.toLowerCase());
          } else if (selectedField === 'address') {
            // For address, perform case-insensitive filtering on the full address string
            const addressString = `${patient.address.street} ${patient.address.city} ${patient.address.state} ${patient.address.zipCode}`;
            return addressString.toLowerCase().startsWith(filterValue.toLowerCase());
          } else if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().startsWith(filterValue.toLowerCase());
          } else if (Array.isArray(fieldValue)) {
            // Check for the selected field in additionalFields array and filter based on its value
            const additionalFieldValue = getAdditionalFieldValueByLabel(patient, selectedField);
            return additionalFieldValue.toLowerCase().includes(filterValue.toLowerCase());
          } else {
            return false;
          }
        } else {
          for (const i in patient['additionalFields']) {
            if (selectedField == patient['additionalFields'][i].label) {
              return (patient['additionalFields'][i].value).toLowerCase().startsWith(filterValue.toLowerCase());
            }
          }
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
  
  const getAdditionalFieldValue = (patient, fieldKey) => {
    const labelRegex = /\[([0-9]+)\]\.value/;
    const match = fieldKey.match(labelRegex);
    if (match) {
      const index = Number(match[1]);
      if (patient.additionalFields && patient.additionalFields.length > index) {
        return patient.additionalFields[index].value;
      }
    }
    return '';
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
    } else if (sortConfig.key.startsWith('additionalFields[')) {
      const index = Number(sortConfig.key.match(/\d+/)[0]);
      const aValue = getAdditionalFieldValue(a, sortConfig.key);
      const bValue = getAdditionalFieldValue(b, sortConfig.key);
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
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
  
  const uniqueAdditionalFieldLabels = new Set();
    data.forEach((patient) => {
      if (patient.additionalFields) {
        patient.additionalFields.forEach((field) => {
          uniqueAdditionalFieldLabels.add(field.label);
        });
      }
  });

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
            {Array.from(uniqueAdditionalFieldLabels).map((label, index) => (
              <th key={index} onClick={() => handleHeaderClick(`additionalFields[${index}].value`)}>
                {label} {sortConfig.key === `additionalFields[${index}].value` && (sortConfig.direction === 'asc' ? '▲' : '▼')}
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
              {Array.from(uniqueAdditionalFieldLabels).map((label, index) => (
                <td key={index}>{getAdditionalFieldValueByLabel(patient, label)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDatabase;


