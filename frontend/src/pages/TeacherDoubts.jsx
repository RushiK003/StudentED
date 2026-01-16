import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeacherDoubts = () => {
    // user unused
    const [doubts, setDoubts] = useState([]);
    const [className, setClassName] = useState(''); // Teacher enters class ID to manage

    useEffect(() => {
        // Ideally fetch teacher's assigned classes. For prototype, we ask or default.
    }, []);

    const fetchDoubts = async (clsId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/doubts/${clsId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerify = async (id, currentAnswer) => {
        const newAnswer = prompt("Edit Answer (Leave empty to keep current):", currentAnswer);
        try {
            const token = localStorage.getItem('token');
            await api.put(`/doubts/${id}/verify`, {
                isVerified: true,
                teacherAnswer: newAnswer || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Verified!");
            fetchDoubts(className);
        } catch (err) {
            console.error(err); // use err
            alert("Failed to verify");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Review Doubts</h1>

            <div className="mb-6 bg-white p-4 rounded shadow">
                <label className="mr-2 font-bold">Manage Class ID:</label>
                <input
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="border p-1 rounded"
                    placeholder="Enter Class ID"
                />
                <button
                    onClick={() => fetchDoubts(className)}
                    className="ml-2 bg-indigo-600 text-white px-4 py-1 rounded"
                >
                    Load Doubts
                </button>
            </div>

            <div className="space-y-4">
                {doubts.map(doubt => (
                    <div key={doubt._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{doubt.question}</h3>
                            {doubt.isVerified ? (
                                <span className="text-green-600 font-bold">✓ Verified</span>
                            ) : (
                                <button
                                    onClick={() => handleVerify(doubt._id, doubt.teacherAnswer || doubt.aiAnswer)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                    ★ Star & Verify
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Student: {doubt.studentId?.username}</p>

                        <div className="bg-gray-50 p-3 rounded">
                            <p className="font-semibold text-gray-700">Current Answer:</p>
                            <p>{doubt.teacherAnswer || doubt.aiAnswer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherDoubts;
