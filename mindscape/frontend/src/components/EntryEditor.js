import React, { useState } from 'react';
import api from '../api';

function EntryEditor() {
  const [content, setContent] = useState('');

  const saveEntry = async () => {
    const result = await api.post('/entries', { content });
    if (result._id) {
      alert('Entry saved!');
    }
  };

  return (
    <div>
      <textarea
        rows="6"
        cols="50"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
      />
      <br />
      <button onClick={saveEntry}>Save Entry</button>
    </div>
  );
}

export default EntryEditor;