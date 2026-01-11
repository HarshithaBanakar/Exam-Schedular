import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/50">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
