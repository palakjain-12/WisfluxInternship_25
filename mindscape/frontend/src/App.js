import React, { useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import EntryEditor from './components/EntryEditor';
import EntryList from './components/EntryList';
import { getToken, removeToken } from './auth';
import './App.css';

function App() {
  const isAuthenticated = !!getToken();

  const handleLogout = () => {
    removeToken();
    window.location.href = '/';
  };

  return (
    <div className="App">
      <h1>MindSpace 🧠</h1>
      
      {isAuthenticated && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/journal" replace /> : 
            <AuthForm isLogin={false} />
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/journal" replace /> : 
            <AuthForm isLogin={true} />
          } 
        />
        <Route 
          path="/journal" 
          element={
            isAuthenticated ? 
            <JournalLayout /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </div>
  );
}

function JournalLayout() {
  const entryListRef = useRef();

  const handleEntrySaved = () => {
    // Refresh the entry list when a new entry is saved
    if (entryListRef.current) {
      entryListRef.current.refresh();
    }
  };

  return (
    <div className="journal-container">
      <EntryEditor onEntrySaved={handleEntrySaved} />
      <EntryList ref={entryListRef} />
    </div>
  );
}

export default App;