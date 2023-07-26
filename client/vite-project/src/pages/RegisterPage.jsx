import React from 'react';
import RegisterForm from "../components/RegisterForm";
import '../styles/login.css';

const RegisterPage = () => {
  return (
    <div className='container'>
      <div className='title'>Register</div>
        <RegisterForm />
    </div>
  );
};

export default RegisterPage;
