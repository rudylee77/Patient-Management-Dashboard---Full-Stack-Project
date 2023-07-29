import React, { useEffect, useState } from 'react';
import PatientDatabase from "../components/PatientDatabase";
import '../styles/filter.css';

const FilterPatients = () => {
  const [filters, setFilters] = useState([{ selectedField: '', filterValue: '' }]);
  const [fieldOptions, setFieldOptions] = useState([]);

  useEffect(() => {
    // Fetch the list of patients from the JSON server
    fetch('http://localhost:4000/patients')
      .then((response) => response.json())
      .then((data) => {
        // Extract the available field options from the patient data
        const allFields = data.reduce((fields, patient) => {
          return Object.keys(patient).reduce((patientFields, key) => {
            if (key !== 'id' && !fields.includes(key)) {
              return [...patientFields, key];
            }
            return patientFields;
          }, fields);
        }, []);
        setFieldOptions(allFields);
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
    // Add more fields if needed
  };

  const handleAddFilter = () => {
    setFilters([...filters, { selectedField: '', filterValue: '' }]);
  };

  const handleRemoveFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleChangeFilterField = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].selectedField = value;
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
    <div key={index} className='form-group'>
      <label htmlFor={`fields-${index}`}>Select a field:</label>
      <select
        id={`fields-${index}`}
        value={filter.selectedField}
        onChange={(e) => handleChangeFilterField(index, e.target.value)}
      >
        <option className value=''>Select a field</option>
        {fieldOptions.map((field, index) => (
          <option key={index} value={field}>{fieldLabels[field]}</option>
        ))}
      </select>
      <label className='label' htmlFor={`filterValue-${index}`}>Enter a value:</label>
      <input
        type='text'
        id={`filterValue-${index}`}
        value={filter.filterValue}
        onChange={(e) => handleChangeFilterValue(index, e.target.value)}
      />
      <button className='button' onClick={() => handleRemoveFilter(index)}>Remove</button>
    </div>
  ))}
  <button className='button' onClick={handleAddFilter}>Add Filter</button>
  <PatientDatabase filters={filters} />
</div>

  );
};

export default FilterPatients;
