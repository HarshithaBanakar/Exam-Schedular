import React from 'react';
import { Calendar, Clock, MapPin, Edit2, Trash2, Book, GraduationCap } from 'lucide-react';

const ExamCard = ({ exam, onEdit, onDelete }) => {
    const isCompleted = new Date(`${exam.date}T${exam.endTime}`) < new Date();

    const typeColors = {
        'ESA': 'text-purple-700 bg-purple-50 border-purple-200',
        'ISA': 'text-blue-700 bg-blue-50 border-blue-200',
    };

    return (
        <div className={`glass-card rounded-xl border relative overflow-hidden group 
      ${isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-100'}`}>

            {/* Top Stripe */}
            <div className={`h-1.5 w-full ${exam.type === 'ESA' ? 'bg-purple-500' : 'bg-blue-500'}`} />

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeColors[exam.type] || 'text-slate-600 bg-slate-100'}`}>
                            {exam.type}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">
                            SEM {exam.semester}
                        </span>
                    </div>

                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isCompleted ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
                        {isCompleted ? 'Completed' : 'Scheduled'}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{exam.title}</h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-4">
                    <Book size={14} className="text-slate-400" /> {exam.course}
                </p>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Date</span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-500" />
                            {new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Time</span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                            <Clock size={14} className="text-indigo-500" />
                            {exam.startTime} - {exam.endTime}
                        </span>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 mt-1">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">{exam.venue || 'No Venue Assigned'}</span>
                </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                <button
                    onClick={() => onEdit(exam)}
                    className="p-1.5 bg-white text-slate-500 hover:text-indigo-600 rounded-md shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors"
                    title="Edit"
                >
                    <Edit2 size={14} />
                </button>
                <button
                    onClick={() => onDelete(exam)}
                    className="p-1.5 bg-white text-slate-500 hover:text-red-600 rounded-md shadow-sm border border-slate-100 hover:border-red-100 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default ExamCard;
