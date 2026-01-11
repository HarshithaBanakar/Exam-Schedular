import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { api } from '../services/api';
import ExamCard from '../components/ExamCard';
import ExamFormModal from '../components/ExamFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import FilterTabs from '../components/FilterTabs';
import TimelineView from '../components/TimelineView';

const ScheduleList = () => {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [completionFilter, setCompletionFilter] = useState('Scheduled'); // Scheduled | Completed

    // Modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [examToDelete, setExamToDelete] = useState(null);

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.exams.getAll();
            setExams(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const now = new Date();

        let result = exams.filter(e => {
            const examDate = new Date(`${e.date}T${e.endTime}`);
            // Note: simple date comparison works if format is YYYY-MM-DD
            if (completionFilter === 'Scheduled') {
                return examDate >= now;
            } else {
                return examDate < now;
            }
        });

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(lower) ||
                e.course.toLowerCase().includes(lower) ||
                (e.venue && e.venue.toLowerCase().includes(lower))
            );
        }

        // Sort: Scheduled -> Ascending, Completed -> Descending
        result.sort((a, b) => {
            const dA = new Date(`${a.date}T${a.startTime}`);
            const dB = new Date(`${b.date}T${b.startTime}`);
            return completionFilter === 'Scheduled' ? dA - dB : dB - dA;
        });

        setFilteredExams(result);
    }, [searchQuery, completionFilter, exams]);

    const handleCreate = async (data) => {
        await api.exams.create(data);
        loadData();
    };

    const handleUpdate = async (data) => {
        await api.exams.update(editingExam.id, data);
        loadData();
    };

    const handleDeleteConfirm = async () => {
        if (!examToDelete) return;
        await api.exams.delete(examToDelete.id);
        setIsDeleteOpen(false);
        setExamToDelete(null);
        loadData();
    };

    const openEdit = (exam) => {
        setEditingExam(exam);
        setIsFormOpen(true);
    };

    const openCreate = () => {
        setEditingExam(null);
        setIsFormOpen(true);
    };

    const promptDelete = (exam) => {
        setExamToDelete(exam);
        setIsDeleteOpen(true);
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Exam Schedules</h1>
                    <p className="text-slate-500">Manage upcoming and completed examinations.</p>
                </div>
                <button onClick={openCreate} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2">
                    <Plus size={20} /> Schedule Exam
                </button>
            </div>

            {/* Controls Bar */}
            <div className="glass-panel p-2 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto px-2">
                    <FilterTabs currentFilter={completionFilter} onFilterChange={setCompletionFilter} />

                    <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search exams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50 border-none outline-none text-sm w-full pl-9 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg h-9 items-center mx-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('timeline')}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'timeline' ? 'bg-white text-indigo-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Timeline
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredExams.length === 0 ? (
                <div className="text-center py-24 bg-white/40 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">No exams found</h3>
                    <p className="text-slate-500">Try adjusting your filters or create a new schedule.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExams.map(exam => (
                                <ExamCard
                                    key={exam.id}
                                    exam={exam}
                                    onEdit={openEdit}
                                    onDelete={promptDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <TimelineView
                            exams={filteredExams}
                            onEdit={openEdit}
                            onDelete={promptDelete}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <ExamFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={editingExam ? handleUpdate : handleCreate}
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

export default ScheduleList;
