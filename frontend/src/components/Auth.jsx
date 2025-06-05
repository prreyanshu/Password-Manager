import React, { useState } from 'react';
import { register, login } from '../api';
import './Auth.css';

const Auth = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoginError('');
    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        await register({ username, password });
      }
      setAuthenticated(true);
    } catch (err) {
      if (isLogin) {
        setLoginError('Credentials are wrong');
      }
      setError(
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'An error occurred'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
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
          {loginError && <div className="error-message">{loginError}</div>}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>                  
      </div>
    </div>
  );
};

export default Auth;