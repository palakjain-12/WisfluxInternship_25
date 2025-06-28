const express = require('express');
const {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getMoodAnalytics,
  searchEntries
} = require('../controllers/entryController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/entries
// @desc    Create new journal entry
// @access  Private
router.post('/', createEntry);

// @route   GET /api/entries
// @desc    Get all entries for user
// @access  Private
router.get('/', getEntries);

// @route   GET /api/entries/search
// @desc    Search entries
// @access  Private
router.get('/search', searchEntries);

// @route   GET /api/entries/analytics/mood
// @desc    Get mood analytics
// @access  Private
router.get('/analytics/mood', getMoodAnalytics);

// @route   GET /api/entries/:id
// @desc    Get single entry
// @access  Private
router.get('/:id', getEntry);

// @route   PUT /api/entries/:id
// @desc    Update entry
// @access  Private
router.put('/:id', updateEntry);

// @route   DELETE /api/entries/:id
// @desc    Delete entry
// @access  Private
router.delete('/:id', deleteEntry);

module.exports = router;