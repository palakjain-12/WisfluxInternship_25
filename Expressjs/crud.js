const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory database (array of users)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

// Helper function to find user by ID
const findUserById = (id) => users.find(user => user.id === parseInt(id));

// Helper function to get next ID
const getNextId = () => users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

// CREATE - Add a new user
// POST /users
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    
    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ 
            error: 'Name and email are required' 
        });
    }
    
    // Create new user
    const newUser = {
        id: getNextId(),
        name,
        email,
        age: age || null
    };
    
    users.push(newUser);
    
    res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
});

// READ - Get all users
// GET /users
app.get('/users', (req, res) => {
    res.json({
        message: 'Users retrieved successfully',
        count: users.length,
        users: users
    });
});

// READ - Get user by ID
// GET /users/:id
app.get('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'User not found' 
        });
    }
    
    res.json({
        message: 'User retrieved successfully',
        user: user
    });
});

// UPDATE - Update user by ID
// PUT /users/:id
app.put('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'User not found' 
        });
    }
    
    const { name, email, age } = req.body;
    
    // Update user properties
    if (name) user.name = name;
    if (email) user.email = email;
    if (age !== undefined) user.age = age;
    
    res.json({
        message: 'User updated successfully',
        user: user
    });
});

// DELETE - Delete user by ID
// DELETE /users/:id
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ 
            error: 'User not found' 
        });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        message: 'User deleted successfully',
        user: deletedUser
    });
});
