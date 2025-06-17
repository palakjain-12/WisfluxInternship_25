const express = require('express');
const router = express.Router();
const { validateTask, validateTaskId } = require('../middleware/validation');

// In-memory storage (replace with database in production)
let tasks = [
    { id: 1, title: 'Learn Express.js', description: 'Build a simple API', completed: false, createdAt: new Date() },
    { id: 2, title: 'Practice REST APIs', description: 'Create CRUD operations', completed: true, createdAt: new Date() }
];
let nextId = 3;

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully'
    });
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', validateTaskId, (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    res.json({
        success: true,
        data: task,
        message: 'Task retrieved successfully'
    });
});

// POST /api/tasks - Create new task
router.post('/', validateTask, (req, res) => {
    const { title, description } = req.body;
    
    const newTask = {
        id: nextId++,
        title,
        description,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
    });
});

// PUT /api/tasks/:id - Update task
router.put('/:id', validateTaskId, validateTask, (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    const { title, description, completed } = req.body;
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
        updatedAt: new Date()
    };
    
    res.json({
        success: true,
        data: tasks[taskIndex],
        message: 'Task updated successfully'
    });
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', validateTaskId, (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    tasks.splice(taskIndex, 1);
    
    res.json({
        success: true,
        message: 'Task deleted successfully'
    });
});

module.exports = router;