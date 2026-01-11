import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const role = user?.role;

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-gray-800">
                Empower
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-800 rounded">
                    Dashboard
                </Link>

                {role === 'student' && (
                    <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">
                            Student Area
                        </div>
                        <Link to="/habits" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Habit Tracker
                        </Link>
                        <Link to="/academic" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Academic Section
                        </Link>
                        <Link to="/forum" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Doubt Forum
                        </Link>
                    </>
                )}

                {role === 'teacher' && (
                    <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">
                            Teacher Area
                        </div>
                        <Link to="/classes" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Class Content Upload
                        </Link>
                        <Link to="/students" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Student Progress
                        </Link>
                        <Link to="/review-doubts" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Review Doubts
                        </Link>
                        <Link to="/analytics" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            Class Analytics
                        </Link>
                    </>
                )}

                {role === 'admin' && (
                    <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">
                            Admin Area
                        </div>
                        <Link to="/users" className="block px-4 py-2 hover:bg-gray-800 rounded">
                            User Management
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="mb-2 text-sm text-gray-400">Logged in as: <span className="text-white capitalize">{user?.username} ({role})</span></div>
                <button
                    onClick={logout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
