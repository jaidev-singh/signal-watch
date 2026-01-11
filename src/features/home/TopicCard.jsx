import React from 'react';
import { groupByStance } from '../../utils/groupByStance';
import { formatTime } from '../../utils/formatTime';
import VideoItem from './VideoItem';

const stanceConfig = {
  'Balanced': { 
    emoji: '', 
    label: 'Event-based',
    color: '#1E3A8A', // Deep blue
    bgColor: '#EFF6FF' // Light blue background
  },
  'Hawkish': { 
    emoji: '', 
    label: 'Interpretive (Analysis)',
    color: '#065F46', // Muted green
    bgColor: '#ECFDF5' // Light green background
  },
  'International': { 
    emoji: '', 
    label: 'Speculative (Assumptions)',
    color: '#92400E', // Soft amber
    bgColor: '#FFFBEB' // Light amber background
  }
};

const TopicCard = ({ topic }) => {
  const groupedVideos = groupByStance(topic.videos);
  const timeAgo = formatTime(topic.updatedAt);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
      {/* Topic Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {topic.title}
        </h2>
        {topic.whyMatters && (
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold" style={{ color: '#1E3A8A' }}>Why this matters:</span> {topic.whyMatters}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3">Last updated {timeAgo}</p>
      </div>

      {/* Videos Grouped by Stance */}
      {Object.entries(groupedVideos).map(([stance, videos]) => {
        const config = stanceConfig[stance] || { 
          emoji: '', 
          label: stance,
          color: '#374151',
          bgColor: '#F3F4F6'
        };
        
        return (
          <div key={stance} className="px-8 py-6 border-b border-gray-100 last:border-b-0">
            <div 
              className="inline-block px-3 py-1.5 rounded-md mb-4 text-xs font-semibold uppercase tracking-wide"
              style={{ 
                backgroundColor: config.bgColor,
                color: config.color
              }}
            >
              {config.label}
            </div>
            
            <div className="space-y-4">
              {videos.map((video) => (
                <VideoItem key={video.id} video={video} showTopic={false} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopicCard;
