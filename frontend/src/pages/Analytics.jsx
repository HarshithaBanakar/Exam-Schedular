import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.exams.getAll();
            setExams(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-slate-400">Loading analytics...</div>;

    // 1. Exams per Type (ISA vs ESA)
    const typeCount = exams.reduce((acc, curr) => {
        const type = curr.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const typeData = Object.keys(typeCount).map(key => ({ name: key, value: typeCount[key] }));

    // 2. Exams per Semester
    const semesterCount = exams.reduce((acc, curr) => {
        if (curr.semester) {
            const label = `Sem ${curr.semester}`;
            acc[label] = (acc[label] || 0) + 1;
        }
        return acc;
    }, {});

    // Sort semesters nicely
    const semesterData = Object.keys(semesterCount)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map(key => ({ name: key, exams: semesterCount[key] }));

    // 3. Status Status (Scheduled vs Completed)
    const now = new Date();
    const completedCount = exams.filter(e => new Date(`${e.date}T${e.endTime}`) < now).length;
    const scheduledCount = exams.length - completedCount;

    const statusData = [
        { name: 'Scheduled', value: scheduledCount },
        { name: 'Completed', value: completedCount }
    ];

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#64748B'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
                <p className="text-slate-500">Insights into examination scheduling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart 1: Exams by Type */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-700 mb-6">Exams by Type</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Exams by Semester */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-700 mb-6">Volume by Semester</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={semesterData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                                <Bar dataKey="exams" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-800">{exams.length}</div>
                    <div className="text-xs font-semibold uppercase text-slate-500 mt-1">Total Exams</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-3xl font-bold text-indigo-600">{scheduledCount}</div>
                    <div className="text-xs font-semibold uppercase text-slate-500 mt-1">Scheduled</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-3xl font-bold text-emerald-600">{completedCount}</div>
                    <div className="text-xs font-semibold uppercase text-slate-500 mt-1">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-3xl font-bold text-purple-600">{exams.filter(e => e.type === 'ESA').length}</div>
                    <div className="text-xs font-semibold uppercase text-slate-500 mt-1">ESA Exams</div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
