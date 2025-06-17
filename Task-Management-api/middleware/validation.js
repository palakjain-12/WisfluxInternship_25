// Validation middleware for task data
const validateTask = (req, res, next) => {
    const { title, description } = req.body;
    
    // Check if title exists and is not empty
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Title is required and must be a non-empty string'
        });
    }
    
    // Check if description exists and is not empty
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Description is required and must be a non-empty string'
        });
    }
    
    // Validate title length
    if (title.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Title must be less than 100 characters'
        });
    }
    
    // Validate description length
    if (description.trim().length > 500) {
        return res.status(400).json({
            success: false,
            message: 'Description must be less than 500 characters'
        });
    }
    
    // Validate completed field if provided (for PUT requests)
    if (req.body.completed !== undefined) {
        if (typeof req.body.completed !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Completed field must be a boolean value'
            });
        }
    }
    
    // Trim whitespace from strings
    req.body.title = title.trim();
    req.body.description = description.trim();
    
    next();
};

// Validation middleware for task ID
const validateTaskId = (req, res, next) => {
    const id = req.params.id;
    
    // Check if ID is a valid number
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID. ID must be a number'
        });
    }
    
    // Check if ID is positive
    if (parseInt(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Task ID must be a positive number'
        });
    }
    
    next();
};

module.exports = {
    validateTask,
    validateTaskId
};