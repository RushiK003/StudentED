import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto h-full w-full">
                {children}
            </div>
        </div>
    );
};

export default Layout;
