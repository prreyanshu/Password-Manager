import React from 'react';

const PasswordList = ({ passwords }) => {
  return (
    <div>
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
