import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [mentorAdvice, setMentorAdvice] = useState('');
    const [loadingAdvice, setLoadingAdvice] = useState(false);

    // New Features State
    const [dailyFocus, setDailyFocus] = useState(['', '', '']);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/student-logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Transform for Chart.js (Last 7 days)
            setStats(res.data.map(l => ({
                day: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
                hours: l.hours
            })).reverse().slice(0, 7));
        } catch (err) {
            console.error(err);
        }
    };

    const getMentorAdvice = async () => {
        setLoadingAdvice(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/ai/mentor-advice', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMentorAdvice(res.data.advice);
        } catch {
            setMentorAdvice("Keep pushing properly! Consistency is key.");
        }
        setLoadingAdvice(false);
    };

    useEffect(() => {
        // Fetch Habit Logs for Chart
        (async () => {
            await fetchStats();
            await getMentorAdvice();
        })();
        // Fetch Tasks (Mocked initial load until connected to DB)
        // fetchTasks(); 
    }, []);



    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, { text: newTask, isCompleted: false }]);
        setNewTask('');
        // Sync with Backend (Todo)
    };

    const toggleTask = (index) => {
        const newTasks = [...tasks];
        newTasks[index].isCompleted = !newTasks[index].isCompleted;
        setTasks(newTasks);
        // Sync with Backend (Todo)
    };

    const colors = ["bg-pink-100 text-pink-700", "bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700"];

    // Chart Options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    const chartData = {
        labels: stats.map(s => s.day),
        datasets: [{
            label: 'Study Hours',
            data: stats.map(s => s.hours),
            backgroundColor: 'rgba(136, 132, 216, 0.8)',
            borderRadius: 4,
        }]
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header: Daily Focus */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello, {user?.username}! 👋</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dailyFocus.map((focus, i) => (
                        <div key={i} className={`p-4 rounded-xl shadow-sm border border-gray-100 ${colors[i]}`}>
                            <label className="text-xs font-bold uppercase tracking-wide opacity-70">Daily Focus #{i + 1}</label>
                            <input
                                className="block w-full bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none text-lg font-semibold mt-1"
                                placeholder="Set a goal..."
                                value={focus}
                                onChange={e => {
                                    const newFocus = [...dailyFocus];
                                    newFocus[i] = e.target.value;
                                    setDailyFocus(newFocus);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">

                {/* Left: Interactive Task List */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>📝</span> Today's Tasks
                    </h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Add a task..."
                            value={newTask}
                            onChange={e => setNewTask(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTask()}
                        />
                        <button onClick={addTask} className="bg-blue-600 text-white rounded-lg px-3 hover:bg-blue-700">+</button>
                    </div>

                    <div className="space-y-2">
                        {tasks.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">No tasks yet. Plan your day!</p>}
                        {tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group transition">
                                <button
                                    onClick={() => toggleTask(i)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition ${task.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                                >
                                    {task.isCompleted && <span className="text-white text-xs">✓</span>}
                                </button>
                                <span className={`flex-1 text-gray-700 ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                    {task.text}
                                </span>
                                <button onClick={() => {
                                    const newTasks = tasks.filter((_, idx) => idx !== i);
                                    setTasks(newTasks);
                                }} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500">×</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Analytics & Roadmap */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Analytics */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">7-Day Study Heatmap</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Consistency Streak: <span className="font-bold text-gray-800">🔥 {stats.length > 3 ? stats.length : 0} Days</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    </div>

                    {/* Future Roadmap */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold opacity-90">Future Roadmap</h3>
                                <p className="text-2xl font-bold mt-1">Full-Stack Developer</p>
                            </div>
                            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                Long Term Goal
                            </div>
                        </div>
                        <div className="mt-6 flex items-end gap-2">
                            <span className="text-4xl font-bold">{stats.reduce((a, b) => a + b.hours, 0)}</span>
                            <span className="mb-1 opacity-80">hours invested this week</span>
                        </div>
                        <div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-white/90 h-full w-[25%]"></div>
                        </div>
                        <p className="text-xs mt-2 opacity-70">25% to next milestone</p>
                    </div>
                </div>
            </div>

            {/* AI Mentor Footer */}
            <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white p-4 rounded-xl shadow-2xl border border-purple-100 z-50 animate-fade-in-up">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-2xl">
                        🧠
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase tracking-wide">AI Mentor Advice</h4>

                        {loadingAdvice ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {mentorAdvice}
                            </p>
                        )}

                        <button
                            onClick={getMentorAdvice}
                            className="mt-3 text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                            Reflect & Refresh ↻
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
