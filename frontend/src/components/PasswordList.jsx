import React from 'react';
import './PasswordList.css';

const PasswordList = ({ passwords }) => {
  return (
    <div className="password-list">
      <h2>Password List</h2>
      <ul>
        {passwords.map((password, index) => (
          <li key={index}>
            {password.appName}: {password.password}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordList;
