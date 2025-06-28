const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [10000, 'Content cannot exceed 10000 characters']
  },
  mood: {
    type: String,
    enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'],
    required: true
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    required: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number, // in minutes
    default: 1
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  entryDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for user and entryDate for efficient queries
entrySchema.index({ user: 1, entryDate: -1 });
entrySchema.index({ user: 1, mood: 1 });

// Calculate word count and reading time before saving
entrySchema.pre('save', function(next) {
  if (this.content) {
    const wordCount = this.content.trim().split(/\s+/).length;
    this.wordCount = wordCount;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
  }
  next();
});

// Virtual for formatted entry date
entrySchema.virtual('formattedDate').get(function() {
  return this.entryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for mood emoji
entrySchema.virtual('moodEmoji').get(function() {
  const moodEmojis = {
    'very_positive': '😄',
    'positive': '😊',
    'neutral': '😐',
    'negative': '😔',
    'very_negative': '😢'
  };
  return moodEmojis[this.mood] || '😐';
});

// Static method to get mood distribution for a user
entrySchema.statics.getMoodDistribution = async function(userId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        entryDate: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 }
      }
    }
  ];
  
  return await this.aggregate(pipeline);
};

// Static method to get entries by date range
entrySchema.statics.getEntriesByDateRange = async function(userId, startDate, endDate) {
  return await this.find({
    user: userId,
    entryDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ entryDate: -1 });
};

module.exports = mongoose.model('Entry', entrySchema);