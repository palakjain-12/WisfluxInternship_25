const express = require('express');
const { createEntry, getEntries } = require('../controllers/entryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createEntry);
router.get('/', getEntries);

module.exports = router;