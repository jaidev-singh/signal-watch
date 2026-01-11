import { useEffect, useState } from 'react';
import creatorsService from '../services/creatorsService';

export function useCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCreators = async () => {
      setLoading(true);
      const data = await creatorsService.getCreators();
      setCreators(data);
      setLoading(false);
    };
    loadCreators();
  }, []);

  const addCreator = async (creatorName) => {
    const updated = await creatorsService.addCreator(creatorName);
    setCreators(updated);
  };

  const deleteCreator = async (creatorName) => {
    const updated = await creatorsService.deleteCreator(creatorName);
    setCreators(updated);
  };

  return {
    creators,
    loading,
    addCreator,
    deleteCreator
  };
}
