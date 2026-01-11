import { useState } from 'react';

export const useFilters = () => {
  const [filters, setFilters] = useState({
    topic: 'all',
    maxDuration: null,
    today: false,
    favorite: false
  });

  const [selectedCreators, setSelectedCreators] = useState([]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCreator = (creator) => {
    setSelectedCreators(prev => {
      if (prev.includes(creator)) {
        return prev.filter(c => c !== creator);
      } else {
        return [...prev, creator];
      }
    });
  };

  return {
    filters,
    updateFilter,
    selectedCreators,
    toggleCreator
  };
};

