import React from 'react';

interface DashboardProps {
  user: {
    email: string;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Добро пожаловать!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Вы вошли как <span className="font-medium text-primary-600">{user.email}</span>.
            </p>
            <div className="mt-8">
                <button
                    onClick={onLogout}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
                >
                    Выйти
                </button>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
