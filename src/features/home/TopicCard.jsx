import React from 'react';
import { groupByStance } from '../../utils/groupByStance';
import { formatTime } from '../../utils/formatTime';
import VideoItem from './VideoItem';

const stanceConfig = {
  'Balanced': { emoji: '🟢', label: 'Balanced / Pragmatic' },
  'Hawkish': { emoji: '🔴', label: 'Strong / Hawkish' },
  'International': { emoji: '🔵', label: 'International / External' }
};

const TopicCard = ({ topic }) => {
  const groupedVideos = groupByStance(topic.videos);
  const timeAgo = formatTime(topic.updatedAt);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200 overflow-hidden">
      {/* Topic Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {topic.title}
        </h2>
        {topic.whyMatters && (
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Why this matters:</span> {topic.whyMatters}
          </p>
        )}
      </div>

      {/* Videos Grouped by Stance */}
      {Object.entries(groupedVideos).map(([stance, videos]) => {
        const config = stanceConfig[stance] || { emoji: '⚪', label: stance };
        
        return (
          <div key={stance} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
              {config.label}
            </h3>
            
            {videos.map((video) => (
              <VideoItem key={video.id} video={video} showTopic={false} />
            ))}
          </div>
        );
      })}

      {/* Follow Topic Button */}
      <button className="mt-4 text-gray-600 hover:text-yellow-500 transition-colors font-medium">
        ☆ Follow Topic
      </button>
    </div>
  );
};

export default TopicCard;
