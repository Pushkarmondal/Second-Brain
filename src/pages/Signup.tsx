import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from './BackendUrl';

const Signup = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async(e: FormEvent) => {
            e.preventDefault();
            try {
                  const response = await axios.post(`${BACKEND_URL}`, {
                        username,
                        password
                  });
                  console.log('Signup Successful:', response.data);
                  navigate('/signin');
            } catch (error) {
                  console.error('Error signing up:', error);
            }
            console.log(`Username: ${username}, Password: ${password}`);
      }
      return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-md w-full space-y-8">
                        <div>
                              <div className="flex justify-center">
                                    <Brain className="h-12 w-12 text-indigo-600" />
                              </div>
                              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                    Create your account
                              </h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                              <div className="rounded-md shadow-sm space-y-4">
                                    <div>
                                          <label htmlFor="username" className="sr-only">Username</label>
                                          <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                required
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Username"
                                          />
                                    </div>
                                    <div>
                                          <label htmlFor="password" className="sr-only">Password</label>
                                          <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Password"
                                          />
                                    </div>
                              </div>

                              <div>
                                    <button
                                          type="submit"
                                          className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                    >
                                          Create account
                                    </button>
                              </div>

                              <div className="text-sm text-center">
                                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                          Already have an account? Sign in
                                    </Link>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default Signup;