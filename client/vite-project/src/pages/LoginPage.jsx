import React from 'react';
import LoginForm from "../components/LoginForm";
import '../styles/login.css';

const LoginPage = () => {
  return (
    <div className='container'>
      <div className='title'>Patient Management System Login</div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
