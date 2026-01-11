import React, { useState, useEffect, useRef } from 'react';

const CreatorFilter = ({ creators, selectedCreators, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6" ref={dropdownRef}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Creator:</h3>
      
      {/* Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-700">
            {selectedCreators.length === 0
              ? 'Select creators...'
              : `${selectedCreators.length} creator${selectedCreators.length > 1 ? 's' : ''} selected`}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {creators.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 italic">
                No creators available
              </div>
            ) : (
              creators.map(creator => {
                const isSelected = selectedCreators.includes(creator);
                return (
                  <label
                    key={creator}
                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(creator)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-900">{creator}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Selected Creators Tags */}
      {selectedCreators.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCreators.map(creator => (
              <span
                key={creator}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {creator}
                <button
                  onClick={() => onToggle(creator)}
                  className="hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => selectedCreators.forEach(c => onToggle(c))}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatorFilter;
