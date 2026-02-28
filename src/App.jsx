import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import './styles/global.css';
import './styles/toasts.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Settings = lazy(() => import('./pages/Settings'));

// Eagerly preload all chunks in the background so navigation is instant
const preloadAll = () => {
  import('./pages/Home');
  import('./pages/Dashboard');
  import('./pages/History');
  import('./pages/Pricing');
  import('./pages/Login');
  import('./pages/Signup');
  import('./pages/Settings');
};

// Show loading screen only once per session
const LOADED_KEY = '__vgai_loaded__';

const App = () => {
  const [isLoading, setIsLoading] = useState(
    () => !sessionStorage.getItem(LOADED_KEY)
  );

  useEffect(() => {
    // Kick off background preload immediately
    preloadAll();
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem(LOADED_KEY, '1');
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          {isLoading && <LoadingScreen onComplete={handleLoadComplete} />}
          <Router>
            <Suspense fallback={<div className="loading-fallback" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
