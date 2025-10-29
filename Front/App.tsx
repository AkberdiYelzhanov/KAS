import React, { useState, useCallback } from 'react';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLoginSuccess = useCallback((userData: { email: string }) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  const toggleView = useCallback(() => {
    setIsLoginView(prev => !prev);
  }, []);


  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {isLoginView ? (
        <Login onLoginSuccess={handleLoginSuccess} toggleView={toggleView} />
      ) : (
        <Register toggleView={toggleView} />
      )}
    </div>
  );
};

export default App;
