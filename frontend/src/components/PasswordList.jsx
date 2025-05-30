import React, { useState } from 'react';
import './PasswordList.css';

const PasswordList = ({ passwords, setPasswords }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which bar is expanded

  const toggleForm = () => {
    setShowForm(!showForm);
    resetForm(); // Reset the form when toggling
  };

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setNote('');
  };

  const generatePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-10); // Simple random password generator
    setPassword(generatedPassword);
  };

  const handleSave = () => {
    if (!title) {
      alert('Title is required!');
      return;
    }

    const newPassword = {
      title,
      username: username || 'N/A',
      password: password || Math.random().toString(36).slice(-10), // Generate password if empty
      note: note || 'N/A',
    };

    if (typeof setPasswords === 'function') {
      setPasswords((prevPasswords) => [...prevPasswords, newPassword]);
    } else {
      console.error('setPasswords is not a function. Please pass it as a prop.');
    }

    setShowForm(false);
    resetForm();
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the expanded bar
  };

  return (
    <div className="password-list">
      <h2>Password List</h2>
      <button className="add-button" onClick={toggleForm}>
        +
      </button>
      {showForm && (
        <div className="password-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="form-group">
            <label>Username (optional):</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <div className="password-input">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Click 'Generate' or enter manually"
              />
              <button type="button" onClick={generatePassword}>
                Generate
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Note (optional):</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a note"
            ></textarea>
          </div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
      <ul className="password-items">
        {passwords.map((password, index) => (
          <li
            key={index}
            className={`password-item ${expandedIndex === index ? 'expanded' : ''}`}
            onClick={() => toggleExpand(index)}
          >
            <div className="password-title">{password.title}</div>
            {expandedIndex === index && (
              <div className="password-details">
                <p><strong>Username:</strong> {password.username}</p>
                <p><strong>Password:</strong> {password.password}</p>
                <p><strong>Note:</strong> {password.note}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordList;
