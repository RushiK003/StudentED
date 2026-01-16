import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const HabitTracker = () => {
    const { } = useAuth(); // user unused
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({ hours: '', mood: '', goals: '', reflection: '' });
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/student-logs', {
                headers: { Authorization: `Bearer ${token} ` }
            });
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchLogs();
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/student-logs', formData, {
                headers: { Authorization: `Bearer ${token} ` }
            });
            setFormData({ hours: '', mood: '', goals: '', reflection: '' });
            fetchLogs(); // Refresh list
        } catch {
            alert("Failed to save log");
        }
    };

    const requestAnalysis = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/student-logs/analyze', {}, {
                headers: { Authorization: `Bearer ${token} ` }
            });
            setAnalysis(res.data.analysis);
        } catch {
            alert("Analysis failed. Make sure you have recent logs.");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Habit Tracker & AI Mentor</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Col: Daily Log Input & History */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Daily Check-in</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Study Hours</label>
                                <input
                                    type="number"
                                    value={formData.hours}
                                    onChange={e => setFormData({ ...formData, hours: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mood</label>
                                <select
                                    value={formData.mood}
                                    onChange={e => setFormData({ ...formData, mood: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                >
                                    <option value="">Select Mood</option>
                                    <option value="Productive">Productive</option>
                                    <option value="Tired">Tired</option>
                                    <option value="Motivated">Motivated</option>
                                    <option value="Stressed">Stressed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Daily Goals</label>
                                <input
                                    type="text"
                                    value={formData.goals}
                                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="e.g. Finish Math HW"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Daily Reflection (Private)</label>
                                <textarea
                                    value={formData.reflection}
                                    onChange={e => setFormData({ ...formData, reflection: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-20"
                                    placeholder="How are you feeling about your progress?"
                                />
                            </div>
                            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                                Log Day
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
                        <div className="space-y-3">
                            {logs.map(log => (
                                <div key={log._id} className="p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                                    <div className="flex justify-between font-medium">
                                        <span>{new Date(log.date).toLocaleDateString()}</span>
                                        <span className="text-blue-600">{log.hours} hrs</span>
                                    </div>
                                    <div>Mood: {log.mood}</div>
                                    <div>Goal: {log.goals}</div>
                                    {log.reflection && <div className="text-gray-500 italic mt-1">"{log.reflection}"</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: AI Mentor */}
                <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">AI Mentor Panel</h2>
                        <button
                            onClick={requestAnalysis}
                            disabled={loading}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 transition"
                        >
                            {loading ? 'Analyzing...' : 'Get Mentor Feedback'}
                        </button>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px] whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {analysis || "Click 'Get Mentor Feedback' to summarize your recent habits and get advice!"}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HabitTracker;
