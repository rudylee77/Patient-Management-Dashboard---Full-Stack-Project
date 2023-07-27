import React from 'react';
import Filter from "../components/Filter";
import '../styles/add.css';

const AddPatients = () => {
  return (
    <div className='dashboard-container'>
        <div className='title'>Filter</div>
        <Filter />
    </div>
    
  );
};

export default AddPatients;
