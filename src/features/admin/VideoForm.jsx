import React, { useState } from 'react';
import { getYoutubeThumbnail } from '../../utils/getYoutubeThumbnail';

const VideoForm = ({ onSubmit, initialVideo = {}, creators = [] }) => {
  const [video, setVideo] = useState({
    channel: initialVideo.channel || '',
    title: initialVideo.title || '',
    duration: initialVideo.duration || '',
    stance: initialVideo.stance || 'Balanced',
    covers: initialVideo.covers || [],
    url: initialVideo.url || '',
    ...initialVideo
  });

  const [coverInput, setCoverInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(video);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideo(prev => ({ ...prev, [name]: value }));
  };

  const addCover = () => {
    if (coverInput.trim()) {
      setVideo(prev => ({
        ...prev,
        covers: [...prev.covers, coverInput.trim()]
      }));
      setCoverInput('');
    }
  };

  const removeCover = (index) => {
    setVideo(prev => ({
      ...prev,
      covers: prev.covers.filter((_, i) => i !== index)
    }));
  };

  const thumbnail = getYoutubeThumbnail(video.url);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-2">
          Channel Name *
        </label>
        {creators.length > 0 ? (
          <select
            id="channel"
            name="channel"
            value={video.channel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a creator...</option>
            {creators.map((creator) => (
              <option key={creator} value={creator}>
                {creator}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="channel"
            name="channel"
            value={video.channel}
            onChange={handleChange}
            placeholder="Enter channel name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
        {creators.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Don't see your creator? Add them in the "Manage Creators" tab first.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Video Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={video.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Duration (MM:SS) *
        </label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={video.duration}
          onChange={handleChange}
          placeholder="18:00"
          pattern="[0-9]{1,3}:[0-9]{2}"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="stance" className="block text-sm font-medium text-gray-700 mb-2">
          Stance *
        </label>
        <select
          id="stance"
          name="stance"
          value={video.stance}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Balanced">Balanced / Pragmatic</option>
          <option value="Hawkish">Strong / Hawkish</option>
          <option value="International">International / External</option>
        </select>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL *
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={video.url}
          onChange={handleChange}
          placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {thumbnail && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <img
              src={thumbnail}
              alt="Video thumbnail preview"
              className="w-48 h-auto rounded border border-gray-300"
              onError={(e) => { 
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        {video.url && !thumbnail && (
          <p className="text-xs text-red-600 mt-2">⚠️ Invalid YouTube URL format</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Covers (Topics)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={coverInput}
            onChange={(e) => setCoverInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCover())}
            placeholder="Add topic tag"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCover}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {video.covers.map((cover, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
            >
              {cover}
              <button
                type="button"
                onClick={() => removeCover(index)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Save Video
      </button>
    </form>
  );
};

export default VideoForm;
