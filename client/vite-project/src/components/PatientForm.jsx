import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientForm = ({ patientData, initialConfigFormFields }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    status: 'Inquiry',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const navigate = useNavigate();
  const [usedLabels, setUsedLabels] = useState([]);
  const [newFieldsData, setNewFieldsData] = useState([{ label: '', value: '' }]);
  const [configFormFields, setconfigFormFields] = useState([]);

  useEffect(() => {
    if (patientData && patientData.id) {
      // Existing patient data (edit mode)
      setFormData({
        firstName: patientData.firstName || '',
        middleName: patientData.middleName || '',
        lastName: patientData.lastName || '',
        dateOfBirth: patientData.dateOfBirth || '',
        status: patientData.status || 'Inquiry',
        address: {
          street: patientData.address?.street || '',
          city: patientData.address?.city || '',
          state: patientData.address?.state || '',
          zipCode: patientData.address?.zipCode || '',
        },
      });

      if (patientData.additionalFields) {
        setconfigFormFields(patientData.additionalFields);
        const usedLabelsFromData = patientData.additionalFields.map((field) => field.label);
        setUsedLabels(usedLabelsFromData);
      } else {
        setconfigFormFields([]);
      }
    } else {
      // If there is no patientData, it means we are adding a new patient
      // Set the initial configFormFields to an empty array
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        status: 'Inquiry',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
      });

      if (initialConfigFormFields) {
        setconfigFormFields([...initialConfigFormFields]);
      } else {
        fetchPatientData();
      }
    }
  }, [patientData, initialConfigFormFields]);

  const fetchPatientData = async () => {
    try {
      const response = await fetch('http://localhost:4000/patients');
      const data = await response.json();
      // Filter patients with additionalFields and get unique field labels
      const additionalFieldsLabels = data
        .filter((patient) => patient.additionalFields)
        .map((patient) => patient.additionalFields.map((field) => field.label))
        .flat()
        .filter((label, index, self) => self.indexOf(label) === index);

      // Create initial config form fields based on the labels
      const initialConfigFields = additionalFieldsLabels.map((label) => ({ label, value: '' }));

      setconfigFormFields(initialConfigFields);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function changeInputType(oldObject, newType) {
    const newObject = document.createElement('input');
    newObject.type = newType;
    
    if (oldObject.size) newObject.size = oldObject.size;
    if (oldObject.value) newObject.value = oldObject.value;
    if (oldObject.name) newObject.name = oldObject.name;
    if (oldObject.id) newObject.id = oldObject.id;
    if (oldObject.className) newObject.className = oldObject.className;
  
    oldObject.parentNode.replaceChild(newObject, oldObject);
    return newObject;
  }

  const handleTypeChange = (e, index) => {
    const { value } = e.target;

    const inputElement = document.querySelector(`input[name="value-${index}"]`);
    changeInputType(inputElement, value);

    const updatedFieldsData = [...newFieldsData];
    updatedFieldsData[index][`type-${index}`] = value;
    setNewFieldsData(updatedFieldsData);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const address = () => {
    return (
      <div>
        <input
          className='fields-address'
          type="text"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleAddressChange}
          name="street"
        />
        <input
          className='fields-address'
          type="text"
          placeholder="City"
          value={formData.address.city}
          onChange={handleAddressChange}
          name="city"
        />
        <input
          className='fields-address'
          type="text"
          placeholder="State"
          value={formData.address.state}
          onChange={handleAddressChange}
          name="state"
        />
        <input
          className='fields-address'
          type="text"
          placeholder="Zip Code"
          value={formData.address.zipCode}
          onChange={handleAddressChange}
          name="zipCode"
        />
      </div>
    );
  }
  

  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    if (index < configFormFields.length) {
      setconfigFormFields((prevFields) => {
        const updatedFields = [...prevFields];
        if (name === 'label') {
          updatedFields[index].label = value;
        } else {
          updatedFields[index].value = value;
        }
        return updatedFields;
      });
    } else {
      const fieldIndex = name.slice(-1);
      if (name.startsWith('label')) {
        configFormFields[fieldIndex].label = value;
      } else {
        configFormFields[fieldIndex].value = value;
      }
    }
  };
  
  const addFields = () => {
    let object = {
      label: '',
      value: ''
    }
    const updatedConfigFormFields = [...configFormFields];
    updatedConfigFormFields.push(object);
    setconfigFormFields(updatedConfigFormFields);
  }

  const removeFields = (index) => {
    const updatedConfigFormFields = [...configFormFields];
    updatedConfigFormFields.splice(index, 1);
    setconfigFormFields(updatedConfigFormFields);
  };

  const removePatient = async (id) => {
    try {
      // Send a PATCH request to the backend to remove the additional patient
      await fetch(`http://localhost:4000/removePatient/${id}`, {
        method: 'PATCH',
      });
      navigate('/dashboard'); // Navigate to the Dashboard after successful delete
    } catch (error) {
      console.error('Error deleting additional field:', error);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    // Prepare the patient data to be sent to the server
    const newPatientData = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      status: formData.status,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zipCode: formData.address.zipCode,
      },
      additionalFields: [
        ...configFormFields, 
      ],
    };

    var toBeRemoved = [];
    for (let i = 0; i < newPatientData.additionalFields.length; i++) {
      if (newPatientData.additionalFields[i].label == '' && newPatientData.additionalFields[i].value == '') {
        toBeRemoved.push(i)
      }
    }
    for (var i = toBeRemoved.length -1; i >= 0; i--)
      newPatientData.additionalFields.splice(toBeRemoved[i],1);

    if (patientData && patientData.id) {
      // If patientData has an ID, it means we are editing an existing patient
      fetch(`http://localhost:4000/patients/${patientData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatientData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Patient updated:', data);
          navigate('/dashboard'); // Navigate to the Dashboard after successful update
        })
        .catch((error) => {
          console.error('Error updating patient:', error);
        });
    } else {
      // If patientData doesn't have an ID, it means we are creating a new patient
      // Use POST request for creating
      fetch('http://localhost:4000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatientData),
      })
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            status: 'Inquiry',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
            },
          });
          setconfigFormFields([]);
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Error adding patient:', error);
        });
    }
  };

  return (
    <div>
      <form className='form-container' onSubmit={submit}>
        <label className='labels'>
          First Name
          <input
            className='fields'
            type="text"
            value={formData.firstName}
            onChange={handleFieldChange}
            name="firstName"
          />
        </label>
        <label className='labels'>
          Middle Name
          <input
            className='fields'
            type="text"
            value={formData.middleName}
            onChange={handleFieldChange}
            name="middleName"
          />
        </label>
        <label className='labels'>
          Last Name
          <input
            className='fields'
            type="text"
            value={formData.lastName}
            onChange={handleFieldChange}
            name="lastName"
          />
        </label>
        <label className='labels'>
          Date of Birth
          <input
            className='fields'
            type="date"
            value={formData.dateOfBirth}
            onChange={handleFieldChange}
            name="dateOfBirth"
          />
        </label>
        <label className='labels'>
          Status
          <select
            className='fields'
            value={formData.status}
            onChange={handleFieldChange}
            name="status"
          >
            <option value="Inquiry">Inquiry</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Active">Active</option>
            <option value="Churned">Churned</option>
          </select>
        </label>
        <label className='labels'>
          Address
          {address()}
        </label>
        {patientData &&
          patientData.additionalFields &&
          patientData.additionalFields.map((field, index) => {
            if (configFormFields.some((existingField) => existingField.label === field.label)) {
              return null; // Skip displaying existing fields that are already present in configFormFields
            }
            return (
              <label key={index} className='labels'>
                {field.label}
                <input
                  className='fields'
                  name={field.label}
                  placeholder={field.label}
                  onChange={(event) => handleFormChange(event, index)}
                  value={field.value}
                />
              </label>
            );
          })}
         {configFormFields.map((form, index) => (
          <div key={index}>
            {form.label ? (
              <label className='labels'>
                {form.label}
                <input
                  className='fields'
                  name={form.label}
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.value}
                />
              </label>
            ) : (
              <div key={index}>
                <label className='labels-config'>
                  <input
                    className='fields-config'
                    name={`label-${index}`}
                    placeholder='New Field Name'
                    onChange={(event) => handleFormChange(event, index + configFormFields.length)}
                    value={newFieldsData[`label-${index}`]} 
                  />
                </label>
                <label className='labels-config'>
                  <input
                    className='fields'
                    name={`value-${index}`}
                    onChange={(event) => handleFormChange(event, index + configFormFields.length)}
                    value={newFieldsData[`value-${index}`]}
                    type={newFieldsData[`type-${index}`]}
                  />
                </label>
                <select
                  className='labels-config-select'
                  name={`type-${index}`}
                  onChange={(e) => handleTypeChange(e, index)}
                  value={newFieldsData[`type-${index}`]}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
                <button
                  type="button"
                  className='config-buttons'
                  onClick={() => removeFields(index)}>
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </form>
      <button className='config-buttons' onClick={addFields}>
        Add Another Field
      </button>
      <br />
      <button className='config-buttons' onClick={submit}>
        Submit
      </button>
      <br />
      <br />
      {patientData && patientData.id && (
        <button className='config-buttons-red' onClick={() => removePatient(patientData.id)}>
          Remove Patient
        </button>
      )}
    </div>
  );
};

export default PatientForm;