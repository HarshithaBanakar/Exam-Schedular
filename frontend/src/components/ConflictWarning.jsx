import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConflictWarning = ({ conflicts }) => {
    if (!conflicts || conflicts.length === 0) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-semibold text-red-900 mb-1">Scheduling Conflict Detected</h4>
                    <p className="text-sm text-red-700 mb-2">
                        The selected time slot overlaps with existing exams:
                    </p>
                    <ul className="space-y-1">
                        {conflicts.map((conflict) => (
                            <li key={conflict.id} className="text-sm text-red-800 bg-red-100/50 px-2 py-1 rounded inline-block mr-2">
                                <strong>{conflict.course}</strong>: {conflict.startTime} - {conflict.endTime}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ConflictWarning;
