import React from 'react';

const ToggleView = ({ view, onChange }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onChange('topics')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          view === 'topics'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Topics
      </button>
      <button
        onClick={() => onChange('creators')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          view === 'creators'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Creators
      </button>
    </div>
  );
};

export default ToggleView;
