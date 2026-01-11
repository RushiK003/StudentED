import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [classId, setClassId] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (isRegistering) {
            // Register Logic
            try {
                await axios.post('http://localhost:5000/api/auth/register', {
                    username,
                    password,
                    role,
                    classId: role === 'student' ? classId : undefined // Only send classId for students if needed, or both
                });
                setSuccessMsg('Registration successful! Please login.');
                setIsRegistering(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Registration failed');
            }
        } else {
            // Login Logic
            const result = await login(username, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {isRegistering && (
                        <>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Class ID (Optional)</label>
                                <input
                                    type="text"
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. ClassA"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-blue-600 font-bold ml-1 hover:underline focus:outline-none"
                        >
                            {isRegistering ? 'Login here' : 'Register here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
