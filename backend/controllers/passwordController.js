const Password = require('../models/Password');

exports.generatePassword = async (req, res) => {
  const { appName } = req.body;
  const password = crypto.randomBytes(8).toString('hex');

  try {
    const newPassword = new Password({ appName, password });
    await newPassword.save();
    res.json({ appName, password });
  } catch (err) {
    res.status(500).json({ message: 'Error generating password', error: err });
  }
};

exports.getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({});
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving passwords', error: err });
  }
};
