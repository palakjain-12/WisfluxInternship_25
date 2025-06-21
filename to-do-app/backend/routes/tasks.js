const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /tasks/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    console.log('POST /tasks - Request body:', req.body);
    
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description || '']
    );
    
    console.log('POST /tasks - Created task:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    console.log('PUT /tasks/:id - Request params:', { id });
    console.log('PUT /tasks/:id - Request body:', req.body);
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    // Validate required fields
    if (title === undefined || title === null || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (completed === undefined || completed === null) {
      return res.status(400).json({ error: 'Completed status is required' });
    }
    
    // Check if task exists first
    const existsResult = await pool.query('SELECT id FROM tasks WHERE id = $1', [parseInt(id)]);
    if (existsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update the task
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title.trim(), description || '', Boolean(completed), parseInt(id)]
    );
    
    console.log('PUT /tasks/:id - Updated task:', result.rows[0]);
    res.json(result.rows[0]);
    
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('DELETE /tasks/:id - Request params:', { id });
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    console.log('DELETE /tasks/:id - Deleted task:', result.rows[0]);
    res.json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test database connection endpoint
router.get('/test/connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'Database connected successfully', 
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    console.error('Database connection test failed:', err);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: err.message 
    });
  }
});

module.exports = router;