import React from 'react';

const FilterBar = ({ filters, updateFilter, topics }) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Topic Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Topic:</label>
            <select
              value={filters.topic}
              onChange={(e) => updateFilter('topic', e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => updateFilter('maxDuration', filters.maxDuration === 15 ? null : 15)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filters.maxDuration === 15
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏱ &lt;15 min
            </button>
            
            <button
              onClick={() => updateFilter('today', !filters.today)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filters.today
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🆕 Today
            </button>
            
            <button
              onClick={() => updateFilter('favorite', !filters.favorite)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filters.favorite
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ Fav
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
