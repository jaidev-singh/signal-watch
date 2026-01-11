import React from 'react';

const FilterBar = ({ filters, updateFilter, topics }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1100px] mx-auto px-6 py-5">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Topic Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">Filter:</label>
            <select
              value={filters.topic}
              onChange={(e) => updateFilter('topic', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                focusRingColor: '#1E3A8A',
                minWidth: '200px'
              }}
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3 ml-2">
            <button
              onClick={() => updateFilter('maxDuration', filters.maxDuration === 15 ? null : 15)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: filters.maxDuration === 15 ? '#1E3A8A' : '#F3F4F6',
                color: filters.maxDuration === 15 ? 'white' : '#6B7280'
              }}
            >
              &lt;15 min
            </button>
            
            <button
              onClick={() => updateFilter('today', !filters.today)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: filters.today ? '#1E3A8A' : '#F3F4F6',
                color: filters.today ? 'white' : '#6B7280'
              }}
            >
              Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
