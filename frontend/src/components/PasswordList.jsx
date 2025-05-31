import React, { useState, useEffect } from 'react';
import { getPasswords, savePassword } from '../api';
import './PasswordList.css';

const PasswordList = () => {
  const [passwords, setPasswords] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Fetch passwords when component mounts
  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const data = await getPasswords();
      setPasswords(data);
      setError(null);
    } catch (err) {
      setError('Failed to load passwords');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInput = () => {
    setShowInput(!showInput);
    setTitle('');
    setPassword('');
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const length = 12;
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const handleSave = async () => {
    if (!title || !password) {
      setError('Please enter both app name and password');
      return;
    }

    try {
      const savedPassword = await savePassword({
        appName: title, // <-- send as appName
        password,
        createdAt: new Date()
      });

      setPasswords(prevPasswords => [...prevPasswords, savedPassword]);
      setShowInput(false);
      setTitle('');
      setPassword('');
      setError('');
    } catch (err) {
      setError('Failed to save password');
      console.error('Save error:', err);
    }
  };

  const handlePasswordClick = (index) => {
    setSelectedPassword(selectedPassword === index ? null : index);
  };

  return (
    <div className="password-list">
      <h2 className="list-title">Password List</h2>
      
      <div className="password-boxes">
        {loading ? (
          <div>Loading...</div>
        ) : passwords.length > 0 ? (
          passwords.map((pass, index) => (
            <div 
              key={pass._id || index}
              onClick={() => handlePasswordClick(index)}
              className="password-box"
            >
              {pass.appName}
              {selectedPassword === index && (
                <div className="password-value">
                  <div><strong>App Name:</strong> {pass.appName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong>Password:</strong> {pass.password}
                    <button
                      className="copy-button"
                      onClick={e => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(pass.password);
                        setCopiedIndex(index);
                        setTimeout(() => setCopiedIndex(null), 1000);
                      }}
                      title="Copy password"
                    >
                      {copiedIndex === index ? 'copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-list">
            <p>No passwords saved</p>
          </div>
        )}
      </div>

      <button className="create-button" onClick={toggleInput}>
        Create Password
      </button>

      {showInput && (
        <div className="password-inputs">
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter App Name"
          />
          <div className="password-generation">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button onClick={generatePassword} className="generate-button">
              Generate
            </button>
            <button onClick={handleSave} className="save-button">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordList;
