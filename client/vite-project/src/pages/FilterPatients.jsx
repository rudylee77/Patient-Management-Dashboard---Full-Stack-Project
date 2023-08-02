import React, { useState, useEffect } from 'react';
import PatientDatabase from '../components/PatientDatabase';
import '../styles/filter.css';

const FilterPatients = () => {
  const [filters, setFilters] = useState([{ selectedField: '', filterValue: '' }]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    // Fetch the list of patients from the JSON server
    fetch('http://localhost:4000/patients')
      .then((response) => response.json())
      .then((data) => {
        // Extract the available field options from the patient data, excluding 'id' and 'additionalFields'
        const allFieldsSet = new Set();
        data.forEach((patient) => {
          Object.keys(patient).forEach((field) => {
            if (field !== 'id' && field !== 'additionalFields') {
              allFieldsSet.add(field);
            }
          });
          if (patient.additionalFields) {
            patient.additionalFields.forEach((field) => {
              allFieldsSet.add(field.label); // Add the labels of additionalFields
            });
          }
        });
        setFieldOptions(Array.from(allFieldsSet));
        setInitialData(data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  // Mapping between field names and their display labels
  const fieldLabels = {
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    status: 'Status',
    address: 'Address',
    // Additional Fields
  };

  const handleAddFilter = () => {
    setFilters([...filters, { selectedField: '', filterValue: '', isAdditionalField: false }]);
  };
  

  const handleRemoveFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleChangeFilterField = (index, value) => {
    const newFilters = [...filters];
    const isAdditionalField = value.startsWith('additionalFields[');
    newFilters[index].selectedField = value;
    newFilters[index].isAdditionalField = isAdditionalField;
    setFilters(newFilters);
  };
  

  const handleChangeFilterValue = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].filterValue = value;
    setFilters(newFilters);
  };

  return (
    <div className='dashboard-container'>
      <div className='title'>Filter</div>
      {filters.map((filter, index) => (
        <div key={`${filter.selectedField}-${index}`} className='form-group'>
          <label htmlFor={`fields-${index}`}>Select a field:</label>
          <select
            id={`fields-${index}`}
            value={filter.selectedField}
            onChange={(e) => handleChangeFilterField(index, e.target.value)}
          >
            <option value=''>Select a field</option>
            {fieldOptions.map((field) => {
              if (!field.startsWith('additionalFields[')) {
                // Exclude the labels of additionalFields
                return (
                  <option key={field} value={field}>
                    {fieldLabels[field] || field}
                  </option>
                );
              }
              return null; // Skip the labels of additionalFields
            })}
          </select>
          <label className='label' htmlFor={`filterValue-${index}`}>
            Enter a value:
          </label>
          <input
            type='text'
            id={`filterValue-${index}`}
            value={filter.filterValue}
            onChange={(e) => handleChangeFilterValue(index, e.target.value)}
          />
          <button className='button' onClick={() => handleRemoveFilter(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className='button' onClick={handleAddFilter}>
        Add Filter
      </button>
      <PatientDatabase data={initialData} filters={filters} />
    </div>
  );
};

export default FilterPatients;
