import React, { useState } from 'react';
import { getYoutubeThumbnail } from '../../utils/getYoutubeThumbnail';

const TopicForm = ({ onSubmit, initialTopic = {}, existingTopics = [] }) => {
  const [isNewTopic, setIsNewTopic] = useState(!initialTopic.id);
  const [topic, setTopic] = useState({
    title: initialTopic.title || '',
    whyMatters: initialTopic.whyMatters || '',
    priority: initialTopic.priority || 1,
    ...initialTopic
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(topic);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopic(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicSelect = (e) => {
    if (e.target.value === 'new') {
      setIsNewTopic(true);
      setTopic({ title: '', whyMatters: '' });
    } else {
      const selected = existingTopics.find(t => t.id === e.target.value);
      if (selected) {
        setIsNewTopic(false);
        setTopic(selected);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {!initialTopic.id && existingTopics.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Existing Topic or Create New
          </label>
          <select
            onChange={handleTopicSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            <option value="new">+ Create New Topic</option>
            {existingTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {isNewTopic && (
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Main News *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={topic.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., India-China Border"
            required
          />
        </div>
      )}

      {!isNewTopic && (
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-gray-700">Selected Topic:</p>
          <p className="text-lg font-bold text-blue-900">{topic.title}</p>
        </div>
      )}

      <div>
        <label htmlFor="whyMatters" className="block text-sm font-medium text-gray-700 mb-2">
          Why This Matters
        </label>
        <textarea
          id="whyMatters"
          name="whyMatters"
          value={topic.whyMatters}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., india security"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
          Display Priority *
        </label>
        <input
          type="number"
          id="priority"
          name="priority"
          value={topic.priority}
          onChange={handleChange}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Lower numbers appear first (1 = top priority). Existing topics will auto-adjust.
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {initialTopic.id ? 'Update Topic' : isNewTopic ? 'Create Topic' : 'Use This Topic'}
      </button>
    </form>
  );
};

export default TopicForm;
