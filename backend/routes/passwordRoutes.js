const express = require('express');
const router = express.Router();
const Password = require('../models/Password');
const auth = require('../middleware/auth');

// Get passwords for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user._id });
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save password for logged-in user
router.post('/', auth, async (req, res) => {
  try {
    const password = new Password({
      title: req.body.title,
      password: req.body.password,
      userId: req.user._id
    });
    const newPassword = await password.save();
    res.status(201).json(newPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
