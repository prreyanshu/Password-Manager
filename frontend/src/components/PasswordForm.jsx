import React, { useState } from 'react';

const PasswordForm = ({ onSave }) => {
  const [appName, setAppName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ appName, password });
    setAppName('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="appName">App Name:</label>
        <input
          type="text"
          id="appName"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save Password</button>
    </form>
  );
};

export default PasswordForm;

