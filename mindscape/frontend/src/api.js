// Simple API utility to talk to backend
const API_URL = 'http://localhost:5000/api';

const api = {
  post: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  },
};

export default api;