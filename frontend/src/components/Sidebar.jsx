import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CalendarDays,
    BarChart3,
    LogOut,
    GraduationCap
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/schedules', icon: CalendarDays, label: 'Exam Schedules' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col z-20 shadow-sm h-screen">
            <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight">ExamPlanner</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Faculty Portal</p>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {user?.name?.charAt(0) || 'F'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 truncate">{user?.name || 'Faculty Member'}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium group"
                >
                    <LogOut size={18} className="group-hover:text-red-500 transition-colors" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
