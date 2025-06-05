const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Password = require('./models/Password');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const generatePassword = () => crypto.randomBytes(8).toString('hex');

const authenticateBasic = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username is taken' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save password
app.post('/generate-password', authenticateBasic, async (req, res) => {
  const { appName, username, note } = req.body; // <-- add username
  const password = generatePassword();
  try {
    const newPassword = new Password({
      appName,
      username, // <-- save username
      password,
      userId: req.user._id,
      note: note || ''
    });
    await newPassword.save();
    res.json(newPassword);
  } catch (err) {
    res.status(500).json({ error: 'Error saving password' });
  }
});

// Fetch passwords
app.get('/passwords', authenticateBasic, async (req, res) => {
  try {
    const userPasswords = await Password.find({ userId: req.user._id }); // Filter by userId
    res.json(userPasswords);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching passwords' });
  }
});

// Update password note
app.patch('/passwords/:id', authenticateBasic, async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.note !== undefined) updateFields.note = req.body.note;
    if (req.body.username !== undefined) updateFields.username = req.body.username;

    const updated = await Password.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateFields,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Password not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating password entry' });
  }
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the index.html file for any other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
