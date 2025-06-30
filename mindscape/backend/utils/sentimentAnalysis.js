// Very basic mock sentiment analysis
function analyzeSentiment(text) {
  const lowerText = text.toLowerCase();
  const positiveWords = ['happy', 'good', 'great', 'love', 'peace'];
  const negativeWords = ['sad', 'bad', 'hate', 'angry'];

  let score = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });

  let mood = "neutral";
  if (score > 0) mood = "positive";
  else if (score < 0) mood = "negative";

  return { mood, score };
}

function extractKeywords(text) {
  const words = text.split(/\s+/).filter(w => w.length > 3);
  const freqMap = {};
  words.forEach(word => freqMap[word] = (freqMap[word] || 0) + 1);
  const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 5).map(([word]) => word);
}

module.exports = { analyzeSentiment, extractKeywords };