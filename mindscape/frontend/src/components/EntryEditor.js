import React, { useState } from 'react';
import api from '../api';

function EntryEditor({ onEntrySaved }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const saveEntry = async () => {
    if (!content.trim()) {
      setError('Please write something before saving');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await api.post('/entries', { content });
      if (result._id) {
        setSuccess('Entry saved successfully! 🎉');
        setContent('');
        // Notify parent component to refresh the list
        if (onEntrySaved) {
          onEntrySaved();
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to save entry');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-editor">
      <h3>✍️ Write Your Thoughts</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today? Share your thoughts, feelings, or experiences..."
          disabled={loading}
          rows={6}
        />
      </div>
      
      <button 
        onClick={saveEntry} 
        className="btn btn-secondary"
        disabled={loading || !content.trim()}
      >
        {loading ? 'Saving...' : 'Save Entry'}
      </button>
      
      {content.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '0.5rem', 
          color: '#718096', 
          fontSize: '0.9rem' 
        }}>
          {content.length} characters
        </div>
      )}
    </div>
  );
}

export default EntryEditor;