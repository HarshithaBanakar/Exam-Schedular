import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import ExamFormModal from '../components/ExamFormModal';
import ExamCard from '../components/ExamCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Dashboard = () => {
    const [exams, setExams] = useState([]);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, esa: 0, isa: 0 });
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [examToDelete, setExamToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await api.exams.getAll();
            const now = new Date();

            // Sort upcoming first
            const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setExams(sorted);

            // Calculate stats
            const upcoming = data.filter(e => new Date(`${e.date}T${e.endTime}`) >= now).length;
            const completed = data.length - upcoming;

            setStats({
                total: data.length,
                upcoming,
                completed,
                esa: data.filter(e => e.type === 'ESA').length,
                isa: data.filter(e => e.type === 'ISA').length
            });
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // Listeners
    const openCreate = () => {
        setEditingExam(null);
        setIsFormOpen(true);
    };

    const openEdit = (exam) => {
        setEditingExam(exam);
        setIsFormOpen(true);
    };

    const promptDelete = (exam) => {
        setExamToDelete(exam);
        setIsDeleteOpen(true);
    };

    // Actions
    const handleSave = async (examData) => {
        try {
            if (editingExam) {
                await api.exams.update(editingExam.id, examData);
            } else {
                await api.exams.create(examData);
            }
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!examToDelete) return;
        await api.exams.delete(examToDelete.id);
        setIsDeleteOpen(false);
        setExamToDelete(null);
        loadData();
    };

    const upcomingExams = exams.filter(e => new Date(`${e.date}T${e.endTime}`) >= new Date()).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Faculty Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of engineering department examinations.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Schedule New Exam
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-600 mb-2 font-medium">
                            <Calendar size={20} /> Total Scheduled
                        </div>
                        <div className="text-4xl font-bold text-slate-800">{stats.total}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-emerald-600 mb-2 font-medium">
                            <Clock size={20} /> Upcoming
                        </div>
                        <div className="text-4xl font-bold text-slate-800">{stats.upcoming}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-amber-600 mb-2 font-medium">
                            <CheckCircle size={20} /> Completed
                        </div>
                        <div className="text-4xl font-bold text-slate-800">{stats.completed}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-purple-50 rounded-full group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-purple-600 mb-2 font-medium">
                            <TrendingUp size={20} /> Type Split
                        </div>
                        <div className="flex items-end gap-3">
                            <div><span className="text-2xl font-bold text-slate-800">{stats.esa}</span> <span className="text-xs text-slate-500 font-bold uppercase">ESA</span></div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div><span className="text-2xl font-bold text-slate-800">{stats.isa}</span> <span className="text-xs text-slate-500 font-bold uppercase">ISA</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Upcoming */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-indigo-600" />
                    Pending Examinations
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full ml-2">Next 3</span>
                </h2>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading schedules...</div>
                ) : upcomingExams.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">No upcoming exams scheduled.</p>
                        <button onClick={() => setIsModalOpen(true)} className="text-indigo-600 font-bold mt-2 hover:underline">Create Schedule</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                exam={exam}
                                onEdit={openEdit}
                                onDelete={promptDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <ExamFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSave}
                initialData={editingExam}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                examTitle={examToDelete?.title}
            />
        </div>
    );
};

export default Dashboard;
