import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Navbar */}
            <nav className="p-6 md:p-8 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <GraduationCap size={24} />
                    </div>
                    <span className="font-bold text-xl text-slate-800 tracking-tight">ExamPlanner</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Sign In</Link>
                    <Link to="/signup" className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 max-w-5xl mx-auto -mt-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Faculty Administration Portal
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Academic Scheduling <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Made Effortless.</span>
                </h1>

                <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
                    The complete solution for engineering faculties to manage exam schedules, detect conflicts instantly, and coordinate academic logistics.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <Link to="/login" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 group">
                        Access Dashboard
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/signup" className="px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg border border-slate-200 hover:border-indigo-100 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md">
                        Create Account
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {[
                    { icon: Calendar, title: "Intelligent Scheduling", desc: "Drag, drop, and organize academic calendars with intuitive tools." },
                    { icon: CheckCircle2, title: "Conflict Detection", desc: "Automatic alerts for venue and time overlaps before they happen." },
                    { icon: GraduationCap, title: "Faculty Centric", desc: "Designed specifically for engineering department workflows." }
                ].map((feature, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <feature.icon size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-2">{feature.title}</h3>
                        <p className="text-slate-500">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>
        </div>
    );
};

export default Landing;
