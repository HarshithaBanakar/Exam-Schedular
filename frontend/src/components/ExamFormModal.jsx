import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, MapPin, Save, AlertTriangle } from 'lucide-react';
import ConflictWarning from './ConflictWarning';
import { api } from '../services/api'; // Ensure this matches your project structure
import { checkConflicts } from '../utils/conflictDetection';

const ExamFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        course: '',
        semester: '',
        type: 'ESA', // Default
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        status: 'Scheduled'
    });

    const [loading, setLoading] = useState(false);
    const [warnings, setWarnings] = useState([]);
    const [allExams, setAllExams] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                // Reset form
                setFormData({
                    title: '',
                    course: '',
                    semester: '', // String or Num
                    type: 'ESA',
                    date: '',
                    startTime: '',
                    endTime: '',
                    venue: '',
                    status: 'Scheduled'
                });
            }
            setWarnings([]);
            setFormErrors({});
            loadExams();
        }
    }, [isOpen, initialData]);

    const loadExams = async () => {
        try {
            const exams = await api.exams.getAll(); // Ensure this API call exists
            setAllExams(exams || []);
        } catch (err) {
            console.error("Failed to load exams", err);
        }
    };

    // Real-time conflict check
    useEffect(() => {
        const conflicts = checkConflicts(formData, allExams);
        setWarnings(conflicts);
    }, [formData.date, formData.startTime, formData.endTime, formData.venue, allExams, formData.venue]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for field
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.title) errors.title = "Exam title is required";
        if (!formData.course) errors.course = "Course code is required";

        // Semester 1-8 logic
        const sem = parseInt(formData.semester);
        if (!sem || sem < 1 || sem > 8) errors.semester = "Semester must be between 1 and 8";

        if (!formData.date) errors.date = "Date is required";
        if (!formData.startTime) errors.startTime = "Start time is required";
        if (!formData.endTime) errors.endTime = "End time is required";
        if (!formData.venue) errors.venue = "Venue is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (warnings.length > 0) {
            if (!window.confirm('Scheduling conflicts detected. Proceed anyway?')) {
                return;
            }
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Edit Exam Details' : 'Schedule New Exam'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <ConflictWarning conflicts={warnings} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Exam Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Advanced Data Structures"
                                className={`input-field ${formErrors.title ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                            />
                            {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                <BookOpen size={16} className="text-slate-400" /> Course Code
                            </label>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="e.g. CS302"
                                className={`input-field ${formErrors.course ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                            />
                            {formErrors.course && <p className="text-xs text-red-500 mt-1">{formErrors.course}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Semester (1-8)</label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                placeholder="1-8"
                                className={`input-field ${formErrors.semester ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                            />
                            {formErrors.semester && <p className="text-xs text-red-500 mt-1">{formErrors.semester}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Exam Type</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {['ESA', 'ISA'].map(type => (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                                        className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${formData.type === type
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" /> Venue / Hall
                            </label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="e.g. LH 101"
                                className={`input-field ${formErrors.venue ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                            />
                            {formErrors.venue && <p className="text-xs text-red-500 mt-1">{formErrors.venue}</p>}
                        </div>

                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 flex items-center gap-2">
                                    <Calendar size={14} /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`input-field ${formErrors.date ? 'border-red-300' : ''}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 flex items-center gap-2">
                                    <Clock size={14} /> Start Time
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className={`input-field ${formErrors.startTime ? 'border-red-300' : ''}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 flex items-center gap-2">
                                    <Clock size={14} /> End Time
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className={`input-field ${formErrors.endTime ? 'border-red-300' : ''}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-medium flex items-center gap-2
                ${warnings.length > 0 ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : ''}`}
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    {warnings.length > 0 ? <AlertTriangle size={18} /> : <Save size={18} />}
                                    {initialData ? 'Update Schedule' : 'Schedule Exam'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamFormModal;
