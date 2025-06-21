const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const taskRoutes = require('../routes/tasks');

// Use routes
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});