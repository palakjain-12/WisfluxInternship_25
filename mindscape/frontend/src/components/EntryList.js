import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import api from '../api';

const EntryList = forwardRef((props, ref) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.get('/entries');
      if (Array.isArray(data)) {
        setEntries(data);
      } else {
        setError(data.error || 'Failed to load entries');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Expose refresh function to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchEntries
  }));

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading your entries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button 
          onClick={fetchEntries}
          style={{ 
            marginLeft: '1rem', 
            background: 'transparent', 
            border: '1px solid white', 
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="entry-list">
      <h3>📖 Your Journal Entries</h3>
      
      {entries.length === 0 ? (
        <div className="empty-state">
          <h4>No entries yet</h4>
          <p>Start writing to see your thoughts and moods tracked over time.</p>
        </div>
      ) : (
        <>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#718096',
            fontSize: '0.9rem'
          }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
          </div>
          
          {entries.map((entry) => (
            <div key={entry._id} className="entry">
              <div className="entry-header">
                <span className="entry-date">
                  {formatDate(entry.date)}
                </span>
                <span className={`mood-tag mood-${entry.mood}`}>
                  {getMoodEmoji(entry.mood)} {entry.mood}
                </span>
              </div>
              
              <div className="entry-content">
                {entry.content}
              </div>
              
              {entry.keywords && entry.keywords.length > 0 && (
                <div className="entry-keywords">
                  {entry.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
});

EntryList.displayName = 'EntryList';

export default EntryList;