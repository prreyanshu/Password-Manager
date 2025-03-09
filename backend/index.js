const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

const users = [];
const passwords = [];

const generatePassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

const authenticateBasic = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).json({ error: 'Invalid credentials' });
  }

  req.user = user;
  next();
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  console.log('Registered users:', users); // Debugging log
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  console.log('Login attempt:', { username, password }); // Debugging log
  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log('Invalid credentials'); // Debugging log
    return res.status(403).json({ error: 'Invalid credentials' });
  }
  res.status(200).json({ message: 'Login successful' });
});

app.post('/generate-password', authenticateBasic, (req, res) => {
  const { appName } = req.body;
  const password = generatePassword();
  passwords.push({ appName, password, username: req.user.username });
  res.json({ appName, password });
});

app.get('/passwords', authenticateBasic, (req, res) => {
  const userPasswords = passwords.filter(p => p.username === req.user.username);
  res.json(userPasswords);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

