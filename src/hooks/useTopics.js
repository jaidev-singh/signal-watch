import { useEffect, useState } from 'react';
import topicsService from '../services/topicsService';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      const data = await topicsService.getTopics();
      setTopics(data);
      setLoading(false);
    };
    loadTopics();
  }, []);

  const addTopic = async (topic) => {
    const updated = await topicsService.addTopic(topic);
    setTopics(updated);
  };

  const updateTopic = async (topicId, data) => {
    const updated = await topicsService.updateTopic(topicId, data);
    setTopics(updated);
  };

  const deleteTopic = async (topicId) => {
    const updated = await topicsService.deleteTopic(topicId);
    setTopics(updated);
  };

  const addVideo = async (topicId, video) => {
    console.log('useTopics.addVideo called:', { topicId, video });
    const updated = await topicsService.addVideo(topicId, video);
    console.log('Video added, updated topics:', updated);
    setTopics(updated);
  };

  const deleteVideo = async (topicId, videoId) => {
    const updated = await topicsService.deleteVideo(topicId, videoId);
    setTopics(updated);
  };

  const deleteTopicsWithPriorityOver30 = async () => {
    const updated = await topicsService.deleteTopicsWithPriorityOver30();
    setTopics(updated);
  };

  return {
    topics,
    loading,
    addTopic,
    updateTopic,
    deleteTopic,
    addVideo,
    deleteVideo,
    deleteTopicsWithPriorityOver30
  };
}
