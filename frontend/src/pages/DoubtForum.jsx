import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DoubtForum = () => {
    const { user } = useAuth();
    const [doubts, setDoubts] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [question, setQuestion] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchDoubts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/doubts/${user.classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchChapters = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/chapters/${user.classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChapters(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?.classId) {
            (async () => {
                await fetchDoubts();
                await fetchChapters();
            })();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('/doubts', {
                question: question,
                classId: user.classId,
                chapterId: selectedChapter || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestion('');
            fetchDoubts();
        } catch {
            alert("Failed to post doubt");
        }
        setLoading(false);
    };

    if (!user?.classId) return <div className="p-8">Join a class to access the Forum.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Doubt Resolution Forum</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ask Question */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Ask a Doubt</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question</label>
                                <textarea
                                    value={question}
                                    onChange={e => setQuestion(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32"
                                    placeholder="What is the mitochondria?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Related Chapter (Optional)</label>
                                <select
                                    value={selectedChapter}
                                    onChange={e => setSelectedChapter(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">General / No Chapter</option>
                                    {chapters.map(chap => (
                                        <option key={chap._id} value={chap._id}>{chap.title}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Selecting a chapter helps AI answer better.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Asking AI...' : 'Post Doubt'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {doubts.map(doubt => (
                        <div key={doubt._id} className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-gray-500">
                                    By {doubt.studentId?.username} • {new Date(doubt.createdAt).toLocaleDateString()}
                                    {doubt.chapterId && <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs">Unit: {doubt.chapterId.title}</span>}
                                </span>
                                {doubt.isVerified && (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                                        ★ Teacher Verified
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-4">{doubt.question}</h3>

                            {doubt.teacherAnswer ? (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                    <p className="font-bold text-green-800 text-sm mb-1">Teacher Answer:</p>
                                    <p className="text-gray-800">{doubt.teacherAnswer}</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                    <p className="font-bold text-blue-800 text-sm mb-1">AI Answer:</p>
                                    <p className="text-gray-800">{doubt.aiAnswer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {doubts.length === 0 && <p className="text-center text-gray-500">No doubts asked yet. Be the first!</p>}
                </div>
            </div>
        </div>
    );
};

export default DoubtForum;
