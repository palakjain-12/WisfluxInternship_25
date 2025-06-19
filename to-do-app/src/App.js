import React, { useState } from 'react';
import Header from './Header';
import TodoInput from './TodoInput';
import TaskList from './TaskList';
import './styles.css';

const App = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
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