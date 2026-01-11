import React from 'react';

const ToggleView = ({ view, onChange }) => {
  return (
    <div className="inline-flex rounded-lg p-1" style={{ backgroundColor: '#F3F4F6' }}>
      <button
        onClick={() => onChange('topics')}
        className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm"
        style={{
          backgroundColor: view === 'topics' ? '#1E3A8A' : 'transparent',
          color: view === 'topics' ? 'white' : '#6B7280'
        }}
      >
        News
      </button>
      <button
        onClick={() => onChange('creators')}
        className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm"
        style={{
          backgroundColor: view === 'creators' ? '#1E3A8A' : 'transparent',
          color: view === 'creators' ? 'white' : '#6B7280'
        }}
      >
        Creators
      </button>
    </div>
  );
};

export default ToggleView;
