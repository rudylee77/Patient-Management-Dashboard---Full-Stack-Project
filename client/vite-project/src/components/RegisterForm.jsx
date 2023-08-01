import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPass, setReEnterPass] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== reEnterPass) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Check if the admin code is correct (assuming the correct code is "12345")
    if (adminCode !== "12345") {
      setErrorMessage("Incorrect admin code!");
      return;
    }

    try {
      // Check if the username is already in use
      const checkUsernameResponse = await axios.post('http://localhost:3000/api/check-username', { username });
      if (checkUsernameResponse.data.usernameExists) {
        setErrorMessage("Username is already in use!");
        return;
      }

      // If the username is not in use, proceed with registration
      const response = await axios.post('http://localhost:3000/api/register', { username, password });
      setErrorMessage('');
      navigate('/dashboard'); // Navigate to the Dashboard after successful registration
    } catch (error) {
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Re-Enter Password"
          value={reEnterPass}
          onChange={(e) => setReEnterPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Admin Code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
        />
        <button type="submit" className="login-register-button">Register</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Register;
