// Simple sentiment analysis using keyword-based approach
// For production, consider using external APIs like Google Cloud Natural Language or AWS Comprehend

const positiveWords = [
  'happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'excellent',
  'fantastic', 'awesome', 'brilliant', 'perfect', 'beautiful', 'success', 'win',
  'celebrate', 'grateful', 'blessed', 'proud', 'accomplished', 'thrilled', 'delighted',
  'cheerful', 'optimistic', 'hopeful', 'content', 'satisfied', 'peaceful', 'calm',
  'relaxed', 'energetic', 'motivated', 'inspired', 'confident', 'strong', 'powerful'
];

const negativeWords = [
  'sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'bad', 'worst',
  'disappointed', 'frustrated', 'stressed', 'anxious', 'worried', 'fear', 'scared',
  'depressed', 'lonely', 'tired', 'exhausted', 'overwhelmed', 'upset', 'hurt',
  'pain', 'suffering', 'struggle', 'difficult', 'hard', 'impossible', 'failure',
  'lose', 'lost', 'broken', 'devastated', 'hopeless', 'helpless', 'weak'
];

const neutralWords = [
  'okay', 'fine', 'normal', 'regular', 'usual', 'typical', 'average', 'standard',
  'ordinary', 'common', 'routine', 'daily', 'work', 'school', 'meeting', 'task'
];

function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      mood: 'neutral',
      confidence: 0
    };
  }

  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 2);
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) {
      positiveCount++;
    } else if (negativeWords.includes(word)) {
      negativeCount++;
    } else if (neutralWords.includes(word)) {
      neutralCount++;
    }
  });

  const totalSentimentWords = positiveCount + negativeCount + neutralCount;
  
  if (totalSentimentWords === 0) {
    return {
      score: 0,
      mood: 'neutral',
      confidence: 0.1
    };
  }

  // Calculate sentiment score (-1 to 1)
  const score = (positiveCount - negativeCount) / Math.max(words.length, 1);
  const normalizedScore = Math.max(-1, Math.min(1, score));

  // Determine mood category
  let mood;
  if (normalizedScore > 0.3) {
    mood = 'very_positive';
  } else if (normalizedScore > 0.1) {
    mood = 'positive';
  } else if (normalizedScore < -0.3) {
    mood = 'very_negative';
  } else if (normalizedScore < -0.1) {
    mood = 'negative';
  } else {
    mood = 'neutral';
  }

  // Calculate confidence based on sentiment word density
  const confidence = Math.min(1, totalSentimentWords / Math.max(words.length * 0.1, 1));

  return {
    score: normalizedScore,
    mood,
    confidence: Math.max(0.1, confidence)
  };
}

function extractKeywords(text, limit = 5) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'under', 'over', 'is', 'was', 'are', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'hers', 'its', 'our', 'their', 'myself', 'yourself', 'himself',
    'herself', 'itself', 'ourselves', 'yourselves', 'themselves'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
}

function getMoodInsights(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return {
      averageScore: 0,
      dominantMood: 'neutral',
      moodTrend: 'stable',
      totalEntries: 0
    };
  }

  const totalScore = entries.reduce((sum, entry) => sum + (entry.sentimentScore || 0), 0);
  const averageScore = totalScore / entries.length;

  // Count mood distribution
  const moodCounts = {};
  entries.forEach(entry => {
    const mood = entry.mood || 'neutral';
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const dominantMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

  // Calculate trend (simple comparison of first half vs second half)
  let moodTrend = 'stable';
  if (entries.length >= 4) {
    const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
    const secondHalf = entries.slice(Math.floor(entries.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + (entry.sentimentScore || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + (entry.sentimentScore || 0), 0) / secondHalf.length;
    
    const difference = secondHalfAvg - firstHalfAvg;
    
    if (difference > 0.1) {
      moodTrend = 'improving';
    } else if (difference < -0.1) {
      moodTrend = 'declining';
    }
  }

  return {
    averageScore: Math.round(averageScore * 100) / 100,
    dominantMood,
    moodTrend,
    totalEntries: entries.length
  };
}

module.exports = {
  analyzeSentiment,
  extractKeywords,
  getMoodInsights
};