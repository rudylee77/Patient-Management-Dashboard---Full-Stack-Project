import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace 'YOUR_LOGIN_API_URL' with the actual login API endpoint
      // const response = await axios.post('YOUR_LOGIN_API_URL', { email, password });
      // console.log('Logged in successfully!', response.data);
      // history.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="login-register-button">Login</button>
      <Link to="/register" className="login-register-button">Register Admin Account</Link>
    </form>
  );
};

export default LoginForm;