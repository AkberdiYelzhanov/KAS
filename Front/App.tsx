
import React, { useState, useCallback } from 'react';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  
  const handleLoginSuccess = useCallback((userData: { email: string }) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Login onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default App;
