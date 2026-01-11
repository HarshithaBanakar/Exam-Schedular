import React from 'react';

const FilterTabs = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="flex bg-slate-100 p-1 rounded-lg h-10 w-fit">
            <button
                onClick={() => onFilterChange('Scheduled')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentFilter === 'Scheduled'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                Scheduled
            </button>
            <button
                onClick={() => onFilterChange('Completed')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentFilter === 'Completed'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                Completed
            </button>
        </div>
    );
};

export default FilterTabs;
