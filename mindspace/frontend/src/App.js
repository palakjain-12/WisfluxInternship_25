import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import EntryEditor from './components/Journal/EntryEditor';
import Timeline from './components/Journal/Timeline';
import Header from './components/Layout/Header';

// Styles
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

// App Layout Component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/write" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EntryEditor />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EntryEditor />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timeline" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Timeline />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;