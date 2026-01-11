import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeacherAnalytics = () => {
    // user unused
    const [data, setData] = useState(null);
    const [className, setClassName] = useState('');

    useEffect(() => {
        // Ideally fetch teacher's class.
    }, []);

    const fetchAnalytics = async (clsId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/analytics/teacher/${clsId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch analytics");
        }
    };

    if (!data) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Class Analytics Dashboard</h1>
                <div className="flex gap-2">
                    <input
                        value={className}
                        onChange={e => setClassName(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Enter Class ID (e.g. ClassA)"
                    />
                    <button
                        onClick={() => fetchAnalytics(className)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Load Data
                    </button>
                </div>
            </div>
        );
    }

    const chartData = {
        labels: data.topDoubts.map(d => d.title),
        datasets: [
            {
                label: 'Number of Doubts',
                data: data.topDoubts.map(d => d.count),
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Top 5 Most Doubted Topics' },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    const resolutionRate = data.doubtResolution.total > 0
        ? Math.round((data.doubtResolution.verified / data.doubtResolution.total) * 100)
        : 0;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Analytics: {className}</h1>
                <button onClick={() => setData(null)} className="text-sm text-gray-500 hover:text-gray-700">Change Class</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* KPI Card 1: Resolution Rate */}
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-l-4 border-green-500">
                    <div>
                        <p className="text-gray-500 font-medium">Resolution Rate</p>
                        <h2 className="text-4xl font-bold text-gray-800">{resolutionRate}%</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Total Doubts</p>
                        <p className="font-bold text-xl">{data.doubtResolution.total}</p>
                    </div>
                </div>

                {/* KPI Card 2: Placeholder for Consistency */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <p className="text-gray-500 font-medium">Class Health</p>
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Students Active this week: <span className="font-bold">--</span></p>
                        <p className="text-xs text-gray-400 mt-1">* Requires full user tracking implementation</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Bar options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default TeacherAnalytics;
