const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let recipes = [
    {
        id: uuidv4(),
        name: "Classic Chocolate Chip Cookies",
        category: "dessert",
        prepTime: 30,
        servings: 24,
        ingredients: [
            "2 1/4 cups all-purpose flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "1 cup butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup brown sugar",
            "2 large eggs",
            "2 teaspoons vanilla extract",
            "2 cups chocolate chips"
        ],
        instructions: "1. Preheat oven to 375°F.\n2. Mix flour, baking soda, and salt in a bowl.\n3. Cream butter and sugars until fluffy.\n4. Beat in eggs and vanilla.\n5. Gradually blend in flour mixture.\n6. Stir in chocolate chips.\n7. Drop rounded tablespoons onto ungreased cookie sheets.\n8. Bake 9-11 minutes until golden brown.\n9. Cool on baking sheet for 2 minutes, then transfer to wire rack.",
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        name: "Quick Vegetable Stir Fry",
        category: "dinner",
        prepTime: 15,
        servings: 4,
        ingredients: [
            "2 tablespoons vegetable oil",
            "1 onion, sliced",
            "2 bell peppers, sliced",
            "2 carrots, julienned",
            "1 cup broccoli florets",
            "3 cloves garlic, minced",
            "2 tablespoons soy sauce",
            "1 tablespoon sesame oil",
            "1 teaspoon ginger, grated",
            "2 green onions, chopped"
        ],
        instructions: "1. Heat oil in a large wok or skillet over high heat.\n2. Add onion and cook for 2 minutes.\n3. Add peppers, carrots, and broccoli. Stir-fry for 3-4 minutes.\n4. Add garlic and ginger, cook for 30 seconds.\n5. Add soy sauce and sesame oil.\n6. Stir-fry for another 2 minutes until vegetables are tender-crisp.\n7. Garnish with green onions and serve immediately over rice.",
        createdAt: new Date().toISOString()
    }
];

// Helper functions
const validateRecipe = (recipe) => {
    const errors = [];
    
    if (!recipe.name || recipe.name.trim().length === 0) {
        errors.push('Recipe name is required');
    }
    
    if (!recipe.category || recipe.category.trim().length === 0) {
        errors.push('Category is required');
    }
    
    if (!recipe.prepTime || recipe.prepTime <= 0) {
        errors.push('Prep time must be a positive number');
    }
    
    if (!recipe.servings || recipe.servings <= 0) {
        errors.push('Servings must be a positive number');
    }
    
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        errors.push('At least one ingredient is required');
    }
    
    if (!recipe.instructions || recipe.instructions.trim().length === 0) {
        errors.push('Instructions are required');
    }
    
    return errors;
};

const findRecipeById = (id) => {
    return recipes.find(recipe => recipe.id === id);
};

const filterRecipes = (searchQuery, category) => {
    let filtered = recipes;
    
    if (category) {
        filtered = filtered.filter(recipe => 
            recipe.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(recipe => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(query)
            ) ||
            recipe.instructions.toLowerCase().includes(query)
        );
    }
    
    return filtered;
};

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all recipes
app.get('/api/recipes', (req, res) => {
    try {
        // Sort by creation date, newest first
        const sortedRecipes = recipes.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        res.json(sortedRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search recipes
app.get('/api/recipes/search', (req, res) => {
    try {
        const { search, category } = req.query;
        const filteredRecipes = filterRecipes(search, category);
        res.json(filteredRecipes);
    } catch (error) {
        console.error('Error searching recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single recipe
app.get('/api/recipes/:id', (req, res) => {
    try {
        const recipe = findRecipeById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new recipe
app.post('/api/recipes', (req, res) => {
    try {
        const recipeData = req.body;
        
        // Validate recipe data
        const validationErrors = validateRecipe(recipeData);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validationErrors 
            });
        }
        
        // Create new recipe
        const newRecipe = {
            id: uuidv4(),
            name: recipeData.name.trim(),
            category: recipeData.category.trim().toLowerCase(),
            prepTime: parseInt(recipeData.prepTime),
            servings: parseInt(recipeData.servings),
            ingredients: recipeData.ingredients.map(ing => ing.trim()).filter(ing => ing.length > 0),
            instructions: recipeData.instructions.trim(),
            createdAt: new Date().toISOString()
        };
        
        recipes.push(newRecipe);
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update recipe
app.put('/api/recipes/:id', (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipeData = req.body;
        
        // Find existing recipe
        const existingRecipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
        if (existingRecipeIndex === -1) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        // Validate recipe data
        const validationErrors = validateRecipe(recipeData);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validationErrors 
            });
        }
        
        // Update recipe
        const updatedRecipe = {
            ...recipes[existingRecipeIndex],
            name: recipeData.name.trim(),
            category: recipeData.category.trim().toLowerCase(),
            prepTime: parseInt(recipeData.prepTime),
            servings: parseInt(recipeData.servings),
            ingredients: recipeData.ingredients.map(ing => ing.trim()).filter(ing => ing.length > 0),
            instructions: recipeData.instructions.trim(),
            updatedAt: new Date().toISOString()
        };
        
        recipes[existingRecipeIndex] = updatedRecipe;
        res.json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete recipe
app.delete('/api/recipes/:id', (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
        
        if (recipeIndex === -1) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        const deletedRecipe = recipes.splice(recipeIndex, 1)[0];
        res.json({ message: 'Recipe deleted successfully', recipe: deletedRecipe });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recipes by category
app.get('/api/recipes/category/:category', (req, res) => {
    try {
        const category = req.params.category.toLowerCase();
        const categoryRecipes = recipes.filter(recipe => 
            recipe.category === category
        );
        res.json(categoryRecipes);
    } catch (error) {
        console.error('Error fetching recipes by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recipe statistics
app.get('/api/stats', (req, res) => {
    try {
        const stats = {
            totalRecipes: recipes.length,
            categories: {},
            avgPrepTime: 0,
            totalServings: 0
        };
        
        // Calculate category counts and averages
        recipes.forEach(recipe => {
            // Category count
            stats.categories[recipe.category] = (stats.categories[recipe.category] || 0) + 1;
            
            // Total prep time and servings for averages
            stats.avgPrepTime += recipe.prepTime;
            stats.totalServings += recipe.servings;
        });
        
        // Calculate averages
        if (recipes.length > 0) {
            stats.avgPrepTime = Math.round(stats.avgPrepTime / recipes.length);
            stats.avgServings = Math.round(stats.totalServings / recipes.length);
        }
        
        res.json(stats);
    } catch (error) {
        console.error('Error calculating stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Recipe Manager Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
    console.log(`API endpoints available at: http://localhost:${PORT}/api/recipes`);
});