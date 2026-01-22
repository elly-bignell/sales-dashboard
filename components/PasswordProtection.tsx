'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PasswordProtectionProps {
    children: ReactNode;
    correctPassword: string;
}

export default function PasswordProtection({ children, correctPassword }: PasswordProtectionProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

  useEffect(() => {
        setMounted(true);
        // Check if already unlocked in session storage
                const unlocked = sessionStorage.getItem('dashboardUnlocked');
        if (unlocked === 'true') {
                setIsUnlocked(true);
        }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
                setIsUnlocked(true);
                sessionStorage.setItem('dashboardUnlocked', 'true');
                setError('');
        } else {
                setError('Incorrect password. Please try again.');
                setPassword('');
        }
  };

  if (!mounted) {
        return null;
  }

  if (!isUnlocked) {
        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                                  <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Dashboard</h1>h1>
                                  <p className="text-center text-gray-600 mb-6">This dashboard is password protected</p>p>
                                  
                                  <form onSubmit={handleSubmit} className="space-y-4">
                                              <div>
                                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Password
                                                            </label>label>
                                                            <input
                                                                              id="password"
                                                                              type="password"
                                                                              value={password}
                                                                              onChange={(e) => setPassword(e.target.value)}
                                                                              placeholder="Enter password"
                                                                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                                            />
                                              </div>div>
                                              
                                    {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                  {error}
                                </div>div>
                                              )}
                                              
                                              <button
                                                              type="submit"
                                                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                                            >
                                                            Unlock
                                              </button>button>
                                  </form>form>
                        </div>div>
                </div>div>
              );
  }
  
    return <>{children}</>>;
}</></div>
