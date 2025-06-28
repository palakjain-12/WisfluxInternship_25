const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streakCount: user.streakCount,
        totalEntries: user.totalEntries,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Check for user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is disabled. Please contact support.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streakCount: user.streakCount,
        totalEntries: user.totalEntries,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streakCount: user.streakCount,
        totalEntries: user.totalEntries,
        joinedDate: user.joinedDate,
        lastEntryDate: user.lastEntryDate
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error fetching user data'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        message: 'Name is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streakCount: user.streakCount,
        totalEntries: user.totalEntries
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error updating profile'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};