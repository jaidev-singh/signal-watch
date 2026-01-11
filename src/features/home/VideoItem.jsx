import React from 'react';
import { parseDuration } from '../../utils/formatTime';
import { getYoutubeThumbnail } from '../../utils/getYoutubeThumbnail';

const VideoItem = ({ video, showTopic = false }) => {
  const duration = parseDuration(video.duration);
  const thumbnail = getYoutubeThumbnail(video.url);
  
  return (
    <div className="flex gap-3 mb-4 pb-4 border-b border-gray-200 last:border-b-0">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={video.title}
          className="w-32 h-20 object-cover rounded-md flex-shrink-0 shadow-sm"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="flex-1">
        <p className="text-gray-800 font-medium mb-1">
          {video.title} <span className="text-gray-500 text-sm font-normal">({duration} min)</span>
        </p>
        <p className="text-sm text-gray-600 mb-2">{video.channel}</p>
        {showTopic && video.topicTitle && (
          <p className="text-xs text-gray-500 mb-2">
            Covers: {video.topicTitle}
          </p>
        )}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

export default VideoItem;
