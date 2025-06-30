import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import EntryEditor from './components/EntryEditor';
import EntryList from './components/EntryList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>MindSpace 🧠</h1>
      <Routes>
        <Route path="/" element={<AuthForm isLogin={false} />} />
        <Route path="/login" element={<AuthForm isLogin={true} />} />
        <Route path="/journal" element={<JournalLayout />} />
      </Routes>
    </div>
  );
}

function JournalLayout() {
  return (
    <>
      <EntryEditor />
      <EntryList />
    </>
  );
}

export default App;