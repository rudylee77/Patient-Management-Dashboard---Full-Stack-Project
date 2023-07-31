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
  const [temporaryFields, setTemporaryFields] = useState([]);

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
        setconfigFormFields(initialConfigFormFields);
      } else {
        fetchPatientData();
      }
    }
  }, [patientData, initialConfigFormFields]);

  const [configFormFields, setconfigFormFields] = useState([]);

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

  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    if (name === 'label') {
      // Handle changes to the label field separately
      setTemporaryFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[index] = {
          ...updatedFields[index],
          label: value, // Update the label field at the given index
        };
        return updatedFields;
      });
    } else {
      // Handle changes to the value field separately
      setTemporaryFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[index] = {
          ...updatedFields[index],
          value: value, // Update the value field at the given index
        };
        return updatedFields;
      });
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
      additionalFields: configFormFields.map((field, index) => ({
        ...field,
        value: temporaryFields[index]?.value || field.value,
      })),
    };

    if (patientData && patientData.id) {
      // If patientData has an ID, it means we are editing an existing patient
      // Use PUT or PATCH request for updating
      fetch(`http://localhost:4000/patients/${patientData.id}`, {
        method: 'PUT', // Use 'PUT' or 'PATCH' method for updating
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

  const addFields = () => {
    let object = {
      label: '',
      value: '',
    };
    setTemporaryFields((prevFields) => [...prevFields, object]);
  
    setconfigFormFields([...configFormFields, object]);
  };

  const removeFields = (index) => {
    let data = [...configFormFields];
    data.splice(index, 1);
    setconfigFormFields(data);
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
        </label>
        {patientData &&
          patientData.additionalFields &&
          patientData.additionalFields.map((field, index) => {
            if (usedLabels.includes(field.label)) {
              return null;
            }
            return (
              <label key={index} className='labels'>
                {field.label}
                <input
                  className='fields'
                  name={field.label}
                  placeholder={field.label}
                  onChange={event => handleFormChange(event, index)}
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
                  value={temporaryFields[index]?.value || form.value} 
                />
              </label>
            ) : (
              <div key={index}>
                <label className='labels-config'>
                  <input
                    className='fields-config'
                    name='label'
                    placeholder='New Field Name'
                    onChange={(event) => handleFormChange(event, index + configFormFields.length)}
                    value={temporaryFields[index]?.value || form.value}
                  />
                </label>
                <label className='labels-config'>
                  <input
                    className='fields'
                    name='value'
                    placeholder='Value'
                    onChange={(event) => handleFormChange(event, index + configFormFields.length)}
                    value={temporaryFields[index]?.value || form.value}
                  />
                </label>
                <button className='config-buttons' onClick={() => removeFields(index)}>
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
    </div>
  );
};

export default PatientForm;