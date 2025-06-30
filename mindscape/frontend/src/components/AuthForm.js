import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setToken } from '../auth';

function AuthForm({ isLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const result = await api.post(endpoint, { username, password });
    if (result.token) {
      setToken(result.token);
      navigate('/journal');
    } else {
      alert(result.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
    </form>
  );
}

export default AuthForm;