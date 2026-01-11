import React from 'react';
import { Clock, MapPin, Edit2, Trash2 } from 'lucide-react';

const TimelineView = ({ exams, onEdit, onDelete }) => {
    // Sort by date/time
    const sorted = [...exams].sort((a, b) => {
        return new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime);
    });

    // Group by date
    const grouped = sorted.reduce((acc, exam) => {
        const dateStr = exam.date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(exam);
        return acc;
    }, {});

    const dates = Object.keys(grouped).sort();

    return (
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-4">
            {dates.map(date => (
                <div key={date} className="relative pl-8">
                    {/* Date Marker */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow-sm ring-1 ring-slate-100"></div>

                    <h3 className="text-lg font-bold text-slate-800 mb-4 inline-flex items-center gap-2">
                        {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>

                    <div className="space-y-3">
                        {grouped[date].map(exam => {
                            const isCompleted = new Date(`${exam.date}T${exam.endTime}`) < new Date();

                            return (
                                <div key={exam.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-slate-50
                  ${isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm'}`}>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border 
                        ${exam.type === 'ESA' ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-blue-700 bg-blue-50 border-blue-200'}`}>
                                                {exam.type}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">
                                                SEM {exam.semester}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg">{exam.title}</h4>
                                        <p className="text-slate-500 text-sm font-medium">{exam.course}</p>

                                        <div className="flex gap-4 mt-2 text-sm text-slate-600">
                                            <span className="flex items-center gap-1.5 font-semibold text-slate-700"><Clock size={16} className="text-indigo-500" /> {exam.startTime} - {exam.endTime}</span>
                                            {exam.venue && <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {exam.venue}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:border-l md:border-slate-100 md:pl-4">
                                        <button
                                            onClick={() => onEdit(exam)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(exam)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimelineView;
