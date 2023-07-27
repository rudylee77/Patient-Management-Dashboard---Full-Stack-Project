import React, { useState } from 'react';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    status: 'Inquiry',
    address: '',
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <label className='labels'>
        First Name:
        <input className='fields'
          type="text"
          value={formData.firstName}
          onChange={handleFieldChange}
          name="firstName"
        />
      </label>
      <label className='labels'>
        Middle Name:
        <input className='fields'
          type="text"
          value={formData.middleName}
          onChange={handleFieldChange}
          name="middleName"
        />
      </label>
      <label className='labels'>
        Last Name:
        <input className='fields'
          type="text"
          value={formData.lastName}
          onChange={handleFieldChange}
          name="lastName"
        />
      </label>
      <label className='labels'>
        Date of Birth:
        <input className='fields'
          type="date"
          value={formData.dateOfBirth}
          onChange={handleFieldChange}
          name="dateOfBirth"
        />
      </label>
      <label className='labels'>
        Status:
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
        Home Address:
        <input className='fields'
          type="text"
          value={formData.address}
          onChange={handleFieldChange}
          name="address"
        />
      </label>
    </div>
  );
};

export default PatientForm;
