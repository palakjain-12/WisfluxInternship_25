// Updated App.js - Connect to PostgreSQL Backend
import React, { useState, useEffect } from 'react';
import Header from './Header';
import TodoInput from './TodoInput';
import TaskList from './TaskList';
import './styles.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - change this to match your backend server
  const API_URL = 'http://localhost:3000/api/tasks';

  // Fetch all tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Make sure your backend server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new task to backend
  const addTask = async (text) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: text,
          description: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      
      // Add the new task to local state
      setTasks([...tasks, {
        id: newTask.id,
        text: newTask.title,
        completed: newTask.completed
      }]);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  // Toggle task completion status
  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.text,
          description: '',
          completed: !task.completed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Update local state
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Delete task from backend
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Remove from local state
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="loading">Loading tasks...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchTasks} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        
        <TodoInput onAddTask={addTask} />
        
        {totalCount > 0 && (
          <div className="task-summary">
            <p>{completedCount} of {totalCount} tasks completed</p>
          </div>
        )}
        
        <TaskList 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          onDeleteTask={deleteTask} 
        />
      </main>
    </div>
  );
};

export default App;