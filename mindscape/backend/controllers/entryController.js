const Entry = require('../models/Entry');
const { analyzeSentiment, extractKeywords } = require('../utils/sentimentAnalysis');

exports.createEntry = async (req, res) => {
  const { content } = req.body;
  const { mood, score } = analyzeSentiment(content);
  const keywords = extractKeywords(content);

  const newEntry = new Entry({
    userId: req.user.id,
    content,
    mood,
    keywords
  });

  await newEntry.save();
  res.json(newEntry);
};

exports.getEntries = async (req, res) => {
  const entries = await Entry.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(entries);
};