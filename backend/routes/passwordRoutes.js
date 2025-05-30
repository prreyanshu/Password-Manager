const express = require('express');
const router = express.Router();
const Password = require('../models/Password'); // Import the Password model
const User = require('../models/User'); // Import the User model

// POST route to save a new password
router.post('/save-password', async (req, res) => {
  const { title, username, password, note } = req.body;

  try {
    // Create a new password document
    const newPassword = new Password({
      title,
      username,
      password,
      note,
    });

    // Save the document to the database
    const savedPassword = await newPassword.save();
    res.status(201).json({ message: 'Password saved successfully', data: savedPassword });
  } catch (err) {
    console.error('Error saving password:', err);
    res.status(500).json({ message: 'Error saving password', error: err });
  }
});

router.get('/get-passwords', async (req, res) => {
  try {
    const passwords = await Password.find({});
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving passwords', error: err });
  }
});

module.exports = router;
