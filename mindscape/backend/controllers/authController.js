const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPass });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, userId: user._id });
};