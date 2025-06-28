const Entry = require('../models/Entry');
const User = require('../models/User');
const { analyzeSentiment, extractKeywords, getMoodInsights } = require('../utils/sentimentAnalysis');

// @desc    Create new journal entry
// @route   POST /api/entries
// @access  Private
const createEntry = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: 'Content is required'
      });
    }

    if (content.length > 10000) {
      return res.status(400).json({
        message: 'Content cannot exceed 10000 characters'
      });
    }

    // Perform sentiment analysis
    const sentimentResult = analyzeSentiment(content);
    const keywords = extractKeywords(content);

    // Create entry
    const entry = await Entry.create({
      user: req.user.id,
      title: title || `Entry - ${new Date().toLocaleDateString()}`,
      content,
      mood: sentimentResult.mood,
      sentimentScore: sentimentResult.score,
      keywords,
      tags: tags || [],
      entryDate: new Date()
    });

    // Update user streak and stats
    const user = await User.findById(req.user.id);
    user.updateStreak();
    await user.save();

    // Populate and return the entry
    const populatedEntry = await Entry.findById(entry._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Entry created successfully',
      entry: populatedEntry
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      message: 'Server error creating entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all entries for user
// @route   GET /api/entries
// @access  Private
const getEntries = async (req, res) => {
  try {
    const { page = 1, limit = 10, mood, startDate, endDate } = req.query;
    
    const query = { user: req.user.id };
    
    // Add mood filter if provided
    if (mood && mood !== 'all') {
      query.mood = mood;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.entryDate = {};
      if (startDate) {
        query.entryDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.entryDate.$lte = new Date(endDate);
      }
    }

    const entries = await Entry.find(query)
      .sort({ entryDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Entry.countDocuments(query);

    res.json({
      success: true,
      entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEntries: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      message: 'Server error fetching entries'
    });
  }
};

// @desc    Get single entry
// @route   GET /api/entries/:id
// @access  Private
const getEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Get entry error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }
    res.status(500).json({
      message: 'Server error fetching entry'
    });
  }
};

// @desc    Update entry
// @route   PUT /api/entries/:id
// @access  Private
const updateEntry = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    let entry = await Entry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    // If content is being updated, recalculate sentiment
    let updateData = { title, tags };
    
    if (content && content !== entry.content) {
      if (content.length > 10000) {
        return res.status(400).json({
          message: 'Content cannot exceed 10000 characters'
        });
      }

      const sentimentResult = analyzeSentiment(content);
      const keywords = extractKeywords(content);
      
      updateData = {
        ...updateData,
        content,
        mood: sentimentResult.mood,
        sentimentScore: sentimentResult.score,
        keywords
      };
    }

    entry = await Entry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Entry updated successfully',
      entry
    });
  } catch (error) {
    console.error('Update entry error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }
    res.status(500).json({
      message: 'Server error updating entry'
    });
  }
};

// @desc    Delete entry
// @route   DELETE /api/entries/:id
// @access  Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }

    await Entry.findByIdAndDelete(req.params.id);

    // Update user's total entries count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalEntries: -1 }
    });

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Entry not found'
      });
    }
    res.status(500).json({
      message: 'Server error deleting entry'
    });
  }
};

// @desc    Get mood analytics
// @route   GET /api/entries/analytics/mood
// @access  Private
const getMoodAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await Entry.find({
      user: req.user.id,
      entryDate: { $gte: startDate }
    }).sort({ entryDate: 1 });

    // Get mood distribution
    const moodDistribution = await Entry.aggregate([
      {
        $match: {
          user: req.user._id,
          entryDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgScore: { $avg: '$sentimentScore' }
        }
      }
    ]);

    // Get daily mood trend
    const dailyMoodTrend = await Entry.aggregate([
      {
        $match: {
          user: req.user._id,
          entryDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } }
          },
          avgSentiment: { $avg: '$sentimentScore' },
          entryCount: { $sum: 1 },
          dominantMood: { $first: '$mood' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    const insights = getMoodInsights(entries);

    res.json({
      success: true,
      analytics: {
        moodDistribution,
        dailyMoodTrend,
        insights,
        period: {
          startDate,
          endDate: new Date(),
          totalDays: parseInt(days)
        }
      }
    });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({
      message: 'Server error fetching analytics'
    });
  }
};

// @desc    Search entries
// @route   GET /api/entries/search
// @access  Private
const searchEntries = async (req, res) => {
  try {
    const { q, mood, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        message: 'Search query is required'
      });
    }

    const query = {
      user: req.user.id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (mood && mood !== 'all') {
      query.mood = mood;
    }

    const entries = await Entry.find(query)
      .sort({ entryDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      results: entries,
      count: entries.length,
      query: q
    });
  } catch (error) {
    console.error('Search entries error:', error);
    res.status(500).json({
      message: 'Server error searching entries'
    });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getMoodAnalytics,
  searchEntries
};