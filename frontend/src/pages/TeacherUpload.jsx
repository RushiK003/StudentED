import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeacherUpload = () => {
    // user unused
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [classId, setClassId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [lastUpload, setLastUpload] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a PDF file');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('pdf', file);
        formData.append('classId', classId);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/chapters/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLastUpload(res.data);
            setTitle('');
            setFile(null);
            setClassId('');
            alert('Upload Successful! AI Analysis Generated.');
        } catch (err) {
            console.error(err);
            alert('Upload failed.');
        }
        setUploading(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Content Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upload Unit PDF</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chapter Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Class ID</label>
                            <input
                                type="text"
                                value={classId}
                                onChange={e => setClassId(e.target.value)}
                                placeholder="e.g. ClassA"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">PDF File</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {uploading ? 'Uploading & Processing...' : 'Upload & Generate AI Topics'}
                        </button>
                    </form>
                </div>

                {/* AI Preview */}
                {lastUpload && (
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
                        <h2 className="text-xl font-bold mb-2 text-green-700">Success! Content Generated</h2>
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-600">AI Summary:</h3>
                            <p className="text-gray-800 italic">{lastUpload.aiSummary}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Key Concepts Identified:</h3>
                            <ul className="list-disc list-inside text-gray-800">
                                {lastUpload.keyConcepts.map((concept, i) => (
                                    <li key={i}>{concept}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherUpload;
