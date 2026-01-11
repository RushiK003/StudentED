import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AcademicView = () => {
    const { user } = useAuth();
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);

    const fetchChapters = async (classId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/chapters/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChapters(res.data);
            if (res.data.length > 0) setSelectedChapter(res.data[0]);
        } catch (err) {
            console.error("Failed to fetch chapters", err);
        }
    };

    useEffect(() => {
        if (user?.classId) {
            (async () => {
                await fetchChapters(user.classId);
            })();
        }
    }, [user]);



    if (!user?.classId) return <div className="p-8">No Class Assigned to you yet.</div>;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Chapter List */}
            <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 font-bold text-gray-700">
                    Course Material ({user.classId})
                </div>
                <ul>
                    {chapters.map(chapter => (
                        <li
                            key={chapter._id}
                            onClick={() => setSelectedChapter(chapter)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${selectedChapter?._id === chapter._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                        >
                            <h3 className="font-semibold">{chapter.title}</h3>
                            <span className="text-xs text-gray-500">Added: {new Date(chapter.createdAt).toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full">
                {selectedChapter ? (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                        {/* PDF Viewer */}
                        <div className="flex-1 bg-gray-200 flex flex-col">
                            <div className="p-2 bg-white border-b text-center font-medium">Original PDF Document</div>
                            <iframe
                                src={`http://localhost:5000${selectedChapter.pdfPath}`}
                                className="w-full h-full"
                                title="PDF Viewer"
                            />
                        </div>

                        {/* AI Topics Panel */}
                        <div className="w-full md:w-1/3 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4 text-indigo-700">AI Topic Analysis</h2>

                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Synopsis</h3>
                                <p className="text-gray-800 leading-relaxed bg-indigo-50 p-4 rounded-lg">
                                    {selectedChapter.aiSummary}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Key Concepts</h3>
                                <ul className="space-y-2">
                                    {selectedChapter.keyConcepts.map((concept, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                                            <span className="text-gray-700">{concept}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a chapter to view content
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicView;
