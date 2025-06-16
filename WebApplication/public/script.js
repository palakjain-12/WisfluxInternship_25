// API Base URL - Update this to match your backend server
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const recipeForm = document.getElementById('recipe-form');
const recipesContainer = document.getElementById('recipes-container');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('recipe-modal');
const modalContent = document.getElementById('recipe-details');
const closeModal = document.querySelector('.close');

// State
let recipes = [];
let currentEditId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    recipeForm.addEventListener('submit', handleSubmitRecipe);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    filterCategory.addEventListener('change', handleSearch);
    closeModal.addEventListener('click', closeRecipeModal);
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeRecipeModal();
        }
    });
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        showMessage('Network error. Please try again.', 'error');
        throw error;
    }
}

async function loadRecipes() {
    try {
        showLoading();
        const data = await apiRequest('/recipes');
        recipes = data;
        displayRecipes(recipes);
    } catch (error) {
        console.error('Failed to load recipes:', error);
        recipesContainer.innerHTML = '<div class="error-message">Failed to load recipes. Please refresh the page.</div>';
    }
}

async function saveRecipe(recipeData) {
    const endpoint = currentEditId ? `/recipes/${currentEditId}` : '/recipes';
    const method = currentEditId ? 'PUT' : 'POST';
    
    return await apiRequest(endpoint, {
        method: method,
        body: JSON.stringify(recipeData)
    });
}

async function deleteRecipe(id) {
    return await apiRequest(`/recipes/${id}`, {
        method: 'DELETE'
    });
}

async function searchRecipes(query, category) {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (category) params.append('category', category);
    
    const endpoint = params.toString() ? `/recipes/search?${params}` : '/recipes';
    return await apiRequest(endpoint);
}

// Event Handlers
async function handleSubmitRecipe(e) {
    e.preventDefault();
    
    const formData = new FormData(recipeForm);
    const recipeData = {
        name: formData.get('name'),
        category: formData.get('category'),
        prepTime: parseInt(formData.get('prepTime')),
        servings: parseInt(formData.get('servings')),
        ingredients: formData.get('ingredients').split('\n').filter(item => item.trim()),
        instructions: formData.get('instructions')
    };
    
    try {
        await saveRecipe(recipeData);
        showMessage(currentEditId ? 'Recipe updated successfully!' : 'Recipe added successfully!', 'success');
        recipeForm.reset();
        currentEditId = null;
        loadRecipes();
    } catch (error) {
        console.error('Failed to save recipe:', error);
    }
}

async function handleSearch() {
    const query = searchInput.value.trim();
    const category = filterCategory.value;
    
    try {
        showLoading();
        const searchResults = await searchRecipes(query, category);
        recipes = searchResults;
        displayRecipes(recipes);
    } catch (error) {
        console.error('Search failed:', error);
    }
}

async function handleDeleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        try {
            await deleteRecipe(id);
            showMessage('Recipe deleted successfully!', 'success');
            loadRecipes();
        } catch (error) {
            console.error('Failed to delete recipe:', error);
        }
    }
}

function handleEditRecipe(recipe) {
    currentEditId = recipe.id;
    
    // Populate form with recipe data
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-category').value = recipe.category;
    document.getElementById('prep-time').value = recipe.prepTime;
    document.getElementById('servings').value = recipe.servings;
    document.getElementById('ingredients').value = recipe.ingredients.join('\n');
    document.getElementById('instructions').value = recipe.instructions;
    
    // Scroll to form
    document.querySelector('.add-recipe-section').scrollIntoView({ behavior: 'smooth' });
    showMessage('Recipe loaded for editing. Update the form and submit.', 'success');
}

function handleViewRecipe(recipe) {
    showRecipeModal(recipe);
}

// Display Functions
function displayRecipes(recipesToShow) {
    if (recipesToShow.length === 0) {
        recipesContainer.innerHTML = '<div class="no-recipes">No recipes found. Add your first recipe above!</div>';
        return;
    }
    
    recipesContainer.innerHTML = recipesToShow.map(recipe => `
        <div class="recipe-card" onclick="handleViewRecipe(${JSON.stringify(recipe).replace(/"/g, '&quot;')})">
            <h3>${escapeHtml(recipe.name)}</h3>
            <div class="recipe-meta">
                <span class="recipe-category">${escapeHtml(recipe.category)}</span>
                <span>${recipe.prepTime} min • ${recipe.servings} servings</span>
            </div>
            <div class="recipe-preview">
                ${recipe.ingredients.slice(0, 3).map(ing => escapeHtml(ing)).join(', ')}
                ${recipe.ingredients.length > 3 ? '...' : ''}
            </div>
            <div class="recipe-actions" onclick="event.stopPropagation()">
                <button class="btn-edit" onclick="handleEditRecipe(${JSON.stringify(recipe).replace(/"/g, '&quot;')})">Edit</button>
                <button class="btn-delete" onclick="handleDeleteRecipe('${recipe.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function showRecipeModal(recipe) {
    modalContent.innerHTML = `
        <div class="recipe-detail">
            <h3>${escapeHtml(recipe.name)}</h3>
            <div class="meta-info">
                <div class="meta-item">
                    <strong>${recipe.prepTime}</strong>
                    <span>Minutes</span>
                </div>
                <div class="meta-item">
                    <strong>${recipe.servings}</strong>
                    <span>Servings</span>
                </div>
                <div class="meta-item">
                    <strong>${escapeHtml(recipe.category)}</strong>
                    <span>Category</span>
                </div>
            </div>
            
            <div class="ingredients-list">
                <h4>Ingredients</h4>
                <ul>
                    ${recipe.ingredients.map(ingredient => 
                        `<li>${escapeHtml(ingredient)}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="instructions-list">
                <h4>Instructions</h4>
                <div>${escapeHtml(recipe.instructions).replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function closeRecipeModal() {
    modal.style.display = 'none';
}

function showLoading() {
    recipesContainer.innerHTML = '<div class="loading">Loading recipes...</div>';
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle offline/online status
window.addEventListener('online', function() {
    showMessage('Connection restored', 'success');
    loadRecipes();
});

window.addEventListener('offline', function() {
    showMessage('You are offline. Some features may not work.', 'error');
});