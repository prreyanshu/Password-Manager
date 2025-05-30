import React, { useState, useEffect } from 'react';
import { savePassword, getPasswords } from './api';
import PasswordList from './components/PasswordList';
import Auth from './components/Auth';
import './index.css';

const App = () => {
  const [appName, setAppName] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const handleGeneratePassword = async () => {
    try {
      const newPassword = await savePassword({ appName });
      setPasswords([...passwords, newPassword]);
      setAppName('');
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const data = await getPasswords();
        setPasswords(data);
      } catch (err) {
        setError(err.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchPasswords();
    }
  }, [authenticated]);

  if (!authenticated) {
    return <Auth setAuthenticated={setAuthenticated} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Password Manager</h1>
      {/* Pass both passwords and setPasswords as props */}
      <PasswordList passwords={passwords} setPasswords={setPasswords} />
    </div>
  );
};

export default App;
