import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import '../styles/login.css';

const HomePage = () => {
  return (
    <div className='container'>
      <div className='title'>Patient Management System Login</div>
      <LoginForm />

      <Link to="/register">
        <button className='login-register'>Register</button>
      </Link>
    </div>
  );
};

export default HomePage;