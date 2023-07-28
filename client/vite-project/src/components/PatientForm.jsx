import React, { useState } from 'react';

const PatientForm = () => {
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

    const [configFormFields, setconfigFormFields] = useState([]);

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
      let data = [...configFormFields];
      data[index][event.target.name] = event.target.value;
      setconfigFormFields(data);
    }
  
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
          additionalFields: configFormFields,
        };
        fetch('http://localhost:4000/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPatientData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('New patient added:', data);
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
          })
          .catch((error) => {
            console.error('Error adding patient:', error);
          });
      };
    
    const addFields = () => {
      let object = {
        label: '',
        value: ''
      }
  
      setconfigFormFields([...configFormFields, object])
    }
  
    const removeFields = (index) => {
      let data = [...configFormFields];
      data.splice(index, 1)
      setconfigFormFields(data)
    }
    
    return (
      <div>
        <form className='form-container' onSubmit={submit}>
        <label className='labels'>
        First Name
        <input className='fields'
          type="text"
          value={formData.firstName}
          onChange={handleFieldChange}
          name="firstName"
        />
      </label>
      <label className='labels'>
        Middle Name
        <input className='fields'
          type="text"
          value={formData.middleName}
          onChange={handleFieldChange}
          name="middleName"
        />
      </label>
      <label className='labels'>
        Last Name
        <input className='fields'
          type="text"
          value={formData.lastName}
          onChange={handleFieldChange}
          name="lastName"
        />
      </label>
      <label className='labels'>
        Date of Birth
        <input className='fields'
          type="date"
          value={formData.dateOfBirth}
          onChange={handleFieldChange}
          name="dateOfBirth"
        />
      </label>
      <label className='labels'>
        Status
        <select className='fields'
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
          <input className='fields-address'
            type="text"
            placeholder="Street"
            value={formData.address.street}
            onChange={handleAddressChange}
            name="street"
          />
          <input className='fields-address'
            type="text"
            placeholder="City"
            value={formData.address.city}
            onChange={handleAddressChange}
            name="city"
          />
          <input className='fields-address'
            type="text"
            placeholder="State"
            value={formData.address.state}
            onChange={handleAddressChange}
            name="state"
          />
          <input className='fields-address'
            type="text"
            placeholder="Zip Code"
            value={formData.address.zipCode}
            onChange={handleAddressChange}
            name="zipCode"
          />
        </div>
      </label>
          {configFormFields.map((form, index) => {
            return (
              <div key={index}>
                <label className='labels-config'>
                <input className='fields-config'
                  name='label'
                  placeholder='New Field Name'
                  onChange={event => handleFormChange(event, index)}
                  value={form.label}
                /></label>
                <label className='labels-config'>
                    <input className='fields'
                  name='value'
                  placeholder='Value'
                  onChange={event => handleFormChange(event, index)}
                  value={form.value}
                /></label>
                <button className='config-buttons' onClick={() => removeFields(index)}>Remove</button>
              </div>
            )
          })}
        </form>
        <button className='config-buttons' onClick={addFields}>Add Another Field</button>
        <br />
        <button className='config-buttons' onClick={submit}>Submit</button>
      </div>
    );
  };

export default PatientForm;