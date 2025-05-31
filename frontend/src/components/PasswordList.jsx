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
  const [note, setNote] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editNoteValue, setEditNoteValue] = useState('');
  const [entryUsername, setEntryUsername] = useState('');

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
    setNote('');
    setEntryUsername('');
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
      await savePassword({
        appName: title,
        username: entryUsername, // <-- add this
        password,
        note,
        createdAt: new Date()
      });
      await fetchPasswords(); // <-- fetch the full list again
      setShowInput(false);
      setTitle('');
      setPassword('');
      setNote('');
      setError('');
      setEntryUsername('');
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
                  <div><strong>Username:</strong> {pass.username}</div> {/* <-- Move this here */}
                  <div><strong>Password:</strong> {pass.password}</div>
                  {pass.note && editingIndex !== index && (
                    <div>
                      <strong>Note:</strong> {pass.note}
                      <button
                        className="edit-note-button"
                        style={{ marginLeft: '10px' }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingIndex(index);
                          setEditNoteValue(pass.note);
                        }}
                      >
                        Edit Note
                      </button>
                    </div>
                  )}
                  {editingIndex === index && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                      <input
                        type="text"
                        value={editNoteValue}
                        onChange={e => setEditNoteValue(e.target.value)}
                        className="note-input"
                        style={{ flex: 1 }}
                      />
                      <button
                        className="save-note-button"
                        onClick={async e => {
                          e.stopPropagation();
                          // Save the updated note to backend
                          try {
                            await savePassword({
                              appName: pass.appName,
                              password: pass.password,
                              note: editNoteValue,
                              _id: pass._id // assuming your backend can use _id to update
                            }, true); // pass a flag for update if needed
                            await fetchPasswords();
                            setEditingIndex(null);
                          } catch (err) {
                            alert('Failed to update note');
                          }
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-note-button"
                        onClick={e => {
                          e.stopPropagation();
                          setEditingIndex(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <input
            type="text"
            value={entryUsername}
            onChange={e => setEntryUsername(e.target.value)}
            placeholder="Enter Username"
            className="username-input"
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
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="note-input"
          />
        </div>
      )}
    </div>
  );
};

export default PasswordList;
