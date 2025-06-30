import React, { useEffect, useState } from 'react';
import api from '../api';

function EntryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await api.get('/entries');
      setEntries(data);
    };
    fetchEntries();
  }, []);

  return (
    <div>
      <h3>Your Past Entries</h3>
      {entries.map((entry) => (
        <div key={entry._id}>
          <p><strong>{new Date(entry.date).toLocaleDateString()}</strong> - Mood: {entry.mood}</p>
          <p>{entry.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default EntryList;