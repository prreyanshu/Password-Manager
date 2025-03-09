const express = require('express');
const router = express.Router();
const Password = require('../models/Password');

router.post('/save-password', async (req, res) => {
  const { appName, password } = req.body;
  try {
    const newPassword = new Password({ appName, password });
    await newPassword.save();
    res.status(201).json({ message: 'Password saved successfully' });
  } catch (err) {
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
