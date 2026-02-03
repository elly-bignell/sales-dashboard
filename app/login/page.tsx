'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
                const response = await fetch('/api/auth/login', {
                          method: 'POST',
                          headers: {
                                      'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ password }),
                });

          if (!response.ok) {
                    setError('Invalid password');
                    setLoading(false);
                    return;
          }

          // Login successful, redirect to home
          router.push('/');
        } catch (err) {
                setError('An error occurred. Please try again.');
                setLoading(false);
        }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                      <div className="mb-8 text-center">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>h1>
                                <p className="text-gray-600">Enter your password to continue</p>p>
                      </div>div>
              
                      <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                          Password
                                            </label>label>
                                            <input
                                                            type="password"
                                                            id="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Enter password"
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                            disabled={loading}
                                                          />
                                </div>div>
                      
                        {error && <div className="text-red-600 text-sm font-medium">{error}</div>div>}
                      
                                <button
                                              type="submit"
                                              disabled={loading}
                                              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                            >
                                  {loading ? 'Logging in...' : 'Login'}
                                </button>button>
                      </form>form>
              
                      <p className="text-center text-gray-600 text-sm mt-6">
                                Marketing Sweet © 2026
                      </p>p>
              </div>div>
        </div>div>
      );
}</div>
