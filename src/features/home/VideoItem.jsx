import React from 'react';
import { parseDuration } from '../../utils/formatTime';
import { getYoutubeThumbnail } from '../../utils/getYoutubeThumbnail';

const VideoItem = ({ video, showTopic = false }) => {
  const duration = parseDuration(video.duration);
  const thumbnail = getYoutubeThumbnail(video.url);
  
  return (
    <div className="flex gap-5 py-4">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={video.title}
          className="w-48 h-28 object-cover rounded-lg flex-shrink-0"
          style={{ border: '1px solid #E5E7EB' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="flex-1 flex flex-col justify-center">
        <h4 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
          {video.title}
        </h4>
        <p className="text-sm text-gray-500 mb-3">
          {video.channel} · {duration} min
        </p>
        {showTopic && video.topicTitle && (
          <p className="text-xs text-gray-400 mb-3">
            Topic: {video.topicTitle}
          </p>
        )}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors w-fit"
          style={{ backgroundColor: '#1E3A8A' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1E3A8A'}
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

export default VideoItem;
