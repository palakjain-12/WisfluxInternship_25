const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastEntryDate: {
    type: Date,
    default: null
  },
  totalEntries: {
    type: Number,
    default: 0
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak logic
userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastEntry = this.lastEntryDate ? new Date(this.lastEntryDate) : null;
  
  if (lastEntry) {
    lastEntry.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastEntry) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.streakCount += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      this.streakCount = 1;
    }
    // If daysDiff === 0, same day, don't update streak
  } else {
    // First entry
    this.streakCount = 1;
  }
  
  this.lastEntryDate = new Date();
  this.totalEntries += 1;
};

module.exports = mongoose.model('User', userSchema);